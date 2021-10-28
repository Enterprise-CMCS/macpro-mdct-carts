from pathlib import Path
from django.core import management  # type: ignore
from django.core.management.base import BaseCommand
from django.db import connection  # type: ignore

query = """
-- Create staging enrollment counts table
-- And create trigger on the staging table to update carts_api_section

CREATE TABLE IF NOT EXISTS public.stg_enrollment_counts
(
    id SERIAL PRIMARY KEY NOT NULL,
    filter_id VARCHAR(10) NOT NULL,
    state_id CHAR(2)  NOT NULL,
    year_to_modify INTEGER NOT NULL,
    type_of_enrollment VARCHAR(100) NOT NULL,
    enrollment_count INTEGER NOT NULL,
    index_to_update INTEGER NOT NULL,
    modified_on TIMESTAMP,
    modified_by VARCHAR(20)
);

ALTER TABLE IF EXISTS public.stg_enrollment_counts OWNER to pguser;
GRANT ALL ON TABLE public.stg_enrollment_counts TO pguser;
REVOKE ALL ON TABLE public.stg_enrollment_counts FROM readwrite;
GRANT DELETE, UPDATE, INSERT, SELECT ON TABLE public.stg_enrollment_counts TO readwrite;

---

CREATE OR REPLACE FUNCTION public.upd_carts_api_section()
  RETURNS trigger
  AS
$$
DECLARE
   p_cnt integer; p_index integer; p_year integer; p_filter char(10); p_state char(2); p_enrollment_type varchar(500); 
   l_cnt integer; l_sub_cnt integer; l_qst_cnt integer; 
   l_form_id char(5); l_jstr1 varchar(500); l_jstr2 varchar(500); 
   l_record RECORD; 
BEGIN

  IF (TG_OP = 'UPDATE') THEN
    p_filter := OLD.filter_id;
    p_state := OLD.state_id;
    p_year := OLD.year_to_modify;
    p_index := OLD.index_to_update;
    p_enrollment_type := OLD.type_of_enrollment;
  ELSE
    p_filter := NEW.filter_id;
    p_state := NEW.state_id;
    p_year := NEW.year_to_modify;
    p_index := NEW.index_to_update;
    p_enrollment_type := NEW.type_of_enrollment;
  END IF;
  
  SELECT COUNT(*) 
    INTO l_cnt
    FROM public.carts_api_section
   WHERE jsonb_path_exists(contents, '$.** ? (@ == "Enrollment and Uninsured Data")')
     AND (jsonb_path_exists(contents, '$.** ? (@ == "Medicaid Expansion CHIP")')
     OR  (jsonb_path_exists(contents, '$.** ? (@ == "Separate CHIP")'))) 
     AND contents->'section'->>'id' = p_filter
     AND (contents->'section'->'year')::int = p_year
     AND contents->'section'->>'state' = p_state;

  IF (l_cnt > 0) THEN
    /* Get all the subsections in the array */
    SELECT COUNT(DISTINCT(p))-1
      INTO l_sub_cnt
      FROM public.carts_api_section b, jsonb_array_elements(b.contents->'section'->'subsections') p
     WHERE contents->'section'->>'id' = p_filter
       AND (contents->'section'->'year')::int = p_year
       AND contents->'section'->>'state' = p_state;

    WHILE l_sub_cnt >= 0
    LOOP
      /* Get all the parts in the array */
      SELECT COUNT(DISTINCT(p))-1
        INTO p_cnt
        FROM public.carts_api_section b, 
             jsonb_array_elements(b.contents->'section'->'subsections'->l_sub_cnt->'parts') p
       WHERE p->>'title' = 'Number of Children Enrolled in CHIP'
         AND contents->'section'->>'id' = p_filter
         AND (contents->'section'->'year')::int = p_year
         AND contents->'section'->>'state' = p_state;

      WHILE p_cnt >= 0
      LOOP
        /* Get all the questions in the array */
        SELECT COUNT(DISTINCT(p))-1
          INTO l_qst_cnt
          FROM public.carts_api_section b, 
               jsonb_array_elements(b.contents->'section'->'subsections'->l_sub_cnt->'parts'->p_cnt->'questions') p
         WHERE contents->'section'->>'id' = p_filter
           AND (contents->'section'->'year')::int = p_year
           AND contents->'section'->>'state' = p_state;

         WHILE l_qst_cnt >= 0
         LOOP
           FOR l_record IN (
	     SELECT  index-1 as r_index, trim(both '"' from p->>0) as title, p->1 as val1, p->2 as val2, p->3 as val3 
               FROM public.carts_api_section b,  
                    jsonb_array_elements(b.contents->'section'->'subsections'->l_sub_cnt->'parts'->p_cnt->'questions'->l_qst_cnt->'fieldset_info'->'rows') with ordinality arr(p, index)
              WHERE contents->'section'->>'id' = p_filter
                AND (contents->'section'->'year')::int = p_year
                AND contents->'section'->>'state' = p_state 
	   )
           LOOP
             /* Update CHIP */
             IF (p_enrollment_type = l_record.title) THEN
	       l_jstr1 := '{section,subsections,'|| l_sub_cnt ||',parts,'|| p_cnt ||',questions,'|| l_qst_cnt ||',fieldset_info,rows,'|| l_record.r_index||'}';
	       /* Check index of the item to update */ 
               CASE p_index 
                 WHEN 1 THEN 
	           l_jstr2 := '["' || l_record.title || '",' || NEW.enrollment_count || ',' || l_record.val2 || ',' || l_record.val3 || ']'; 
                 WHEN 2 THEN 
	           l_jstr2 := '["' || l_record.title || '",' || l_record.val1 || ',' || NEW.enrollment_count || ',' || l_record.val3 || ']'; 
                 WHEN 3 THEN 
	           l_jstr2 := '["' || l_record.title || '",' || l_record.val1 || ',' || l_record.val2 || ',' || NEW.enrollment_count || ']'; 
               END CASE;
              
               EXECUTE 'UPDATE carts_api_section SET contents = JSONB_SET(contents,'''||l_jstr1||''','||''''||l_jstr2||''''||',FALSE) WHERE contents->''section''->>''id''='||''''||p_filter||'''' ||' AND contents->''section''->''year''='||''''||p_year||''''||' AND contents->''section''->>''state''='||''''||p_state||''''; 

             END IF;
           END LOOP;
           l_qst_cnt := l_qst_cnt - 1;
         END LOOP;
        p_cnt := p_cnt - 1;
      END LOOP;
      l_sub_cnt := l_sub_cnt - 1;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

---
DROP TRIGGER IF EXISTS trg_stg_enrollment_counts ON public.stg_enrollment_counts;
CREATE TRIGGER trg_stg_enrollment_counts
    BEFORE INSERT OR UPDATE 
    ON public.stg_enrollment_counts
    FOR EACH ROW
    EXECUTE FUNCTION upd_carts_api_section();

---
"""


class Command(BaseCommand):
    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute(query)

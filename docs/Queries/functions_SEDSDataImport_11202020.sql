-- *** drop / create neccessary helper table
drop table if exists public.temp_states_to_migrate;
create table public.temp_states_to_migrate (
   user_state     varchar(2) PRIMARY KEY
);
-- *** populate the helper table (states)
insert into public.temp_states_to_migrate
   (user_state)
values
   ('AL'),
   ('AK'),
   ('AZ'),
   ('AR'),
   ('CA'),
   ('CO'),
   ('CT'),
   ('DE'),
   ('DC'),
   ('FL'),
   ('GA'),
   ('HI'),
   ('ID'),
   ('IL'),
   ('IN'),
   ('IA'),
   ('KS'),
   ('KY'),
   ('LA'),
   ('ME'),
   ('MD'),
   ('MA'),
   ('MI'),
   ('MN'),
   ('MS'),
   ('MO'),
   ('MT'),
   ('NE'),
   ('NV'),
   ('NH'),
   ('NJ'),
   ('NM'),
   ('NY'),
   ('NC'),
   ('ND'),
   ('OH'),
   ('OK'),
   ('OR'),
   ('PA'),
   ('RI'),
   ('SC'),
   ('SD'),
   ('TN'),
   ('TX'),
   ('UT'),
   ('VT'),
   ('VA'),
   ('WA'),
   ('WV'),
   ('WI'),
   ('WY');
-- ***************************** FUNCTION DEFINITIONS
-- ***  get_existing_section_2_data
DROP FUNCTION public.get_existing_section_2_data(integer, character varying, character varying);
CREATE OR REPLACE FUNCTION public.get_existing_section_2_data(
   datayear integer,
   datastate character varying,
   dataprogram character varying)
    RETURNS TABLE(id text, state_code character varying, program text, prev_year double precision, current_year double precision, percent_change double precision)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE
    ROWS 1000
AS $BODY$
BEGIN
    RETURN QUERY
        with MCHIP as (
            SELECT  a."StateCode",
                    a."SubmissionDate",
                    SUM(a."LineTotal") as "Line7Total"
            FROM    (
                     SELECT     a."StateCode",
                                a."SubmissionDate",
                                a."AgeRange",
                                a."LineNumber",
                                SUM(
                                    COALESCE(a."Column1", 0) +
                                    COALESCE(a."Column2", 0) +
                                    COALESCE(a."Column3", 0) +
                                    COALESCE(a."Column4", 0) +
                                    COALESCE(a."Column5", 0)
                                   ) as "LineTotal"
                     FROM       schip.tbl64_21E a
                     WHERE      a."LineNumber"                          like '7%'
                      AND       EXTRACT(month from a."SubmissionDate")  = 4
                        GROUP BY
                            a."StateCode",
                            a."SubmissionDate",
                            a."AgeRange",
                            a."LineNumber"  ) a
            WHERE    EXTRACT(year from a."SubmissionDate") = datayear
               OR    EXTRACT(year from a."SubmissionDate") = (datayear - 1)
                GROUP BY
                    a."StateCode",
                    a."SubmissionDate"
        ),
        MedicaidCHIP as (
            SELECT  a."id",
                    a."StateCode",
                    a."program",
                    (SELECT     MCHIP."Line7Total"
                     FROM       MCHIP
                     WHERE      MCHIP."StateCode" = a."StateCode"
                       AND      EXTRACT(year from MCHIP."SubmissionDate") = (datayear - 1)) as "PrevYear",
                    (SELECT     MCHIP."Line7Total"
                     FROM       MCHIP
                     WHERE      MCHIP."StateCode" = a."StateCode"
                       AND      EXTRACT(year from MCHIP."SubmissionDate") = datayear)       as "CurrentYear"
            FROM
                (
                 SELECT     "StateCode",
                            datayear || '-02-a-01' as id,
                            'Medicaid Expansion CHIP' as program
                 FROM       schip.secstate
                ) a
        ),
        SCHIP as (
            SELECT  a."StateCode",
                    a."SubmissionDate",
                    SUM(a."LineTotal") as "Line7Total"
            FROM
                    (
                     SELECT     e."StateCode",
                                e."SubmissionDate",
                                e."ProgramCode",
                                e."AgeRange",
                                e."LineNumber",
                                SUM(
                                    COALESCE(e."Column1", 0) +
                                    COALESCE(e."Column2", 0) +
                                    COALESCE(e."Column3", 0) +
                                    COALESCE(e."Column4", 0) +
                                    COALESCE(e."Column5", 0)) as "LineTotal"
                     FROM       schip.tbl21E e
                     WHERE      e."LineNumber" like '7%'
                       AND      EXTRACT(month from e."SubmissionDate") = 4
                      GROUP BY
                        e."StateCode",
                        e."SubmissionDate",
                        e."ProgramCode",
                        e."AgeRange",
                        e."LineNumber"
                    )  a
                    WHERE   EXTRACT(year from a."SubmissionDate") = datayear
                       OR   EXTRACT(year from a."SubmissionDate") = (datayear - 1)
                      GROUP BY
                        a."StateCode",
                        a."SubmissionDate"
        ),
        SeparateCHIP as (
            SELECT  a."id",
                    a."StateCode",
                    a."program",
                    case when (Select count(1) from SCHIP where SCHIP."StateCode" = a."StateCode") > 0 then (SELECT     SCHIP."Line7Total"
                     FROM       SCHIP
                     WHERE      SCHIP."StateCode" = a."StateCode"
                       AND      EXTRACT(year from SCHIP."SubmissionDate") = (datayear - 1)) else 0 end as "PrevYear",
                    case when (Select count(1) from SCHIP where SCHIP."StateCode" = a."StateCode") > 0 then (SELECT     SCHIP."Line7Total"
                     FROM       SCHIP
                     WHERE      SCHIP."StateCode" = a."StateCode"
                       AND      EXTRACT(year from SCHIP."SubmissionDate") = datayear) else 0 end as "CurrentYear"
            FROM
                (
                 SELECT     "StateCode",
                            datayear || '-02-a-01'                                          as id,
                            'Separate CHIP'                                                 as program
                 FROM       schip.secstate
                ) a
        ),
        combo as (
            SELECT  MedicaidCHIP.id::text
				   ,"StateCode"::character varying
				   ,MedicaidCHIP.program::text
				   ,"PrevYear"
				   ,"CurrentYear"
            FROM    MedicaidCHIP
              UNION ALL
            SELECT  SeparateCHIP.id::text
				   ,"StateCode"::character varying
				   ,SeparateCHIP.program::text
				   ,"PrevYear"
				   ,"CurrentYear"
            FROM    SeparateCHIP)
        SELECT  c.id,
                c."StateCode",
                c."program",
                COALESCE(c."PrevYear", 0)                                            as "PrevYear",
                COALESCE(c."CurrentYear", 0)                                          as "CurrentYear",
                case when c."PrevYear" = 0 or c."PrevYear" is null then 0 else COALESCE(((c."CurrentYear" / c."PrevYear") - 1) * 100, 0) end                   as "PercentChange"
        FROM    combo c
        WHERE   lower(c."StateCode") like '%' || lower(datastate) || '%'
          AND   c.program = dataprogram;
 END;
$BODY$;
 -- ***  migrate_section_2_data
 DROP FUNCTION IF EXISTS public.migrate_section_2_data(integer, varchar, varchar);
 CREATE OR REPLACE FUNCTION public.migrate_section_2_data(
    datayear    integer,
    datastate   varchar,
    metric      varchar
    )
 RETURNS
       void
  AS $$
 DECLARE
     program_name    text;
     prev_year       double precision;
     current_year    double precision;
     percent_change  double precision;
    merged           jsonb;
 BEGIN
    SELECT INTO
        program_name, prev_year, current_year, percent_change
        a.program, a.prev_year, a.current_year, a.percent_change
    FROM   (SELECT *
           FROM  get_existing_section_2_data(datayear, datastate, metric)) a;
    UPDATE carts_api_section
    SET contents =
        CASE WHEN metric = 'Medicaid Expansion CHIP' THEN
            CASE WHEN trim(contents#>'{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 0}'->>0) = 'Medicaid Expansion CHIP' THEN
                 jsonb_set(contents,
                                            '{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 0}',
                                            jsonb_build_array(program_name, prev_year, current_year, percent_change), true)
            ELSE
                jsonb_set(contents,
                                        '{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 1}',
                                        jsonb_build_array(program_name, prev_year, current_year, percent_change), true)
            END
        WHEN metric = 'Separate CHIP' THEN
            CASE WHEN trim(contents#>'{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 0}'->>0) != 'Medicaid Expansion CHIP' THEN
                 jsonb_set(contents,
                                            '{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 0}',
                                            jsonb_build_array(program_name, prev_year, current_year, percent_change), true)
            ELSE
                jsonb_set(contents,
                                        '{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 1}',
                                        jsonb_build_array(program_name, prev_year, current_year, percent_change), true)
            END
       END
    WHERE
        CASE WHEN metric = 'Medicaid Expansion CHIP' THEN
            trim(contents#>'{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 0}'->>0) = metric
        ELSE
            trim(contents#>'{section, subsections, 0, parts, 0, questions, 0, fieldset_info, rows, 1}'->>0) = metric
        END
      AND  contents->'section'->>'state' = datastate;
 END;
 $$
 LANGUAGE PLPGSQL;
-- ***  perform_migrate_section_2
DROP FUNCTION IF EXISTS public.perform_migrate_section_2(integer);
CREATE OR REPLACE FUNCTION public.perform_migrate_section_2(datayear integer)
 RETURNS void AS $$
 DECLARE
   rec              record;
 BEGIN
     FOR rec IN
        SELECT  user_state
        FROM    public.temp_states_to_migrate
     LOOP
        perform public.migrate_section_2_data(datayear, rec.user_state, 'Medicaid Expansion CHIP');
        perform public.migrate_section_2_data(datayear, rec.user_state, 'Separate CHIP');
     END LOOP;
END;
$$
LANGUAGE PLPGSQL;
-- ****************** RUN THE MIGRATION SCRIPT
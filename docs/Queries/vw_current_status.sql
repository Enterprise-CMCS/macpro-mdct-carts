-- View: public.vw_current_status

-- DROP VIEW public.vw_current_status;

CREATE OR REPLACE VIEW public.vw_current_status
 AS
select s.*
from carts_api_statestatus s
	join (select state_id, max(last_changed) as most_recent
		from carts_api_statestatus
		group by state_id) r on r.state_id = s.state_id and r. most_recent = s.last_changed;

ALTER TABLE public.vw_current_status
    OWNER TO pguser;

GRANT ALL ON TABLE public.vw_current_status TO pguser;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.vw_current_status TO readwrite;


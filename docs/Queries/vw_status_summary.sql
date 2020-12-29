-- View: public.vw_status_summary

-- DROP VIEW public.vw_status_summary;

CREATE OR REPLACE VIEW public.vw_status_summary
 AS
select status
	  ,count(state_id) as states
from vw_current_status
group by status;

ALTER TABLE public.vw_status_summary
    OWNER TO pguser;

GRANT ALL ON TABLE public.vw_status_summary TO pguser;
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.vw_status_summary TO readwrite;


-- Table: public.carts_api_statestatus_log

-- DROP TABLE public.carts_api_statestatus_log;

CREATE TABLE public.carts_api_statestatus_log
(
    id serial not null primary key,
    year integer,
    status character varying(32) COLLATE pg_catalog."default" NOT NULL,
    last_changed timestamp with time zone,
    state_id character varying(2) COLLATE pg_catalog."default",
    user_name text COLLATE pg_catalog."default",
    modified_by character varying(20) COLLATE pg_catalog."default",
    modified_on timestamp without time zone,
	operation text COLLATE pg_catalog."default",
	operation_date_ts timestamp without time zone
)
WITH (
    OIDS = FALSE
)
TABLESPACE schipdata;

ALTER TABLE public.carts_api_statestatus_log
    OWNER to pguser;

GRANT ALL ON TABLE public.carts_api_statestatus_log TO pguser;

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.carts_api_statestatus_log TO readwrite;

GRANT SELECT ON TABLE public.carts_api_statestatus_log TO readonly;


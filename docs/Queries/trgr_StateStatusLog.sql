DROP FUNCTION IF EXISTS fn_carts_api_statestatus_log_trigger CASCADE;

CREATE OR REPLACE FUNCTION fn_carts_api_statestatus_log_trigger()
   RETURNS trigger AS
 $BODY$
 BEGIN
     IF (TG_OP = 'INSERT') THEN
         INSERT into carts_api_statestatus_log
             (year, status, last_changed, state_id, user_name, modified_by, modified_on,
              operation, operation_date_ts)
          VALUES (NEW.year, NEW.status, NEW.last_changed, NEW.state_id, NEW.user_name, NEW.modified_by, NEW.modified_on,
                  'I', CURRENT_TIMESTAMP);
         RETURN NEW;
     ELSIF (TG_OP = 'UPDATE') THEN
         INSERT into carts_api_statestatus_log
             (year, status, last_changed, state_id, user_name, modified_by, modified_on,
              operation, operation_date_ts)
          VALUES (NEW.year, NEW.status, NEW.last_changed, NEW.state_id, NEW.user_name, NEW.modified_by, NEW.modified_on,
                  'U', CURRENT_TIMESTAMP);
         RETURN NEW;
     ELSIF (TG_OP = 'DELETE') THEN
         INSERT into carts_api_statestatus_log
             (year, status, last_changed, state_id, user_name, modified_by, modified_on,
              operation, operation_date_ts)
          VALUES (OLD.year, OLD.status, OLD.last_changed, OLD.state_id, OLD.user_name, OLD.modified_by, OLD.modified_on,
                 'D', CURRENT_TIMESTAMP);
         RETURN OLD;
     END IF;
     RETURN NULL;
 END;
 $BODY$
 LANGUAGE PLPGSQL;
 
 /* create carts_api_statestatus_log trigger */
 DROP TRIGGER IF EXISTS tgr_INSERT_UPDATE_carts_api_statestatus_log ON carts_api_statestatus;
 CREATE TRIGGER tgr_INSERT_UPDATE_carts_api_statestatus_log
 BEFORE INSERT OR UPDATE OR DELETE
 ON carts_api_statestatus
 FOR EACH ROW
 EXECUTE PROCEDURE fn_carts_api_statestatus_log_trigger();
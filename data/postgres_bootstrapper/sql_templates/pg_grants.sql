-- Grant privileges to schema, roles
SET pg.users = '[{"username":"mdct_app","password":"@p9P@5s","roles":["readwrite","readonly"]},{"username":"mdct_ro","password":"R09P@5s","roles":["readonly"]},{"username":"schip","password":"schip","roles":["readonly"]},{"username":"schipannualreports","password":"schipannualreports","roles":["readonly"]}]';

DO $$
DECLARE
  tablespace VARCHAR = 'schipdata';
  readonlyRole VARCHAR = 'readonly';
  readwriteRole VARCHAR = 'readwrite';
  pg_users JSONB = current_setting('pg.users');
  db_user JSONB;
  pg_user_roles JSONB;
  db_role JSONB;
BEGIN
  FOR db_user IN SELECT * FROM jsonb_array_elements(pg_users)
  LOOP
    -- Grant access on tablespace to users
    EXECUTE FORMAT('GRANT CREATE ON TABLESPACE %s TO %s', tablespace, db_user->>'username'::text);
    -- Grant read-write access on schema to read-write role

    -- Roles
    pg_user_roles = db_user->>'roles'::text;
    FOR db_role IN SELECT * FROM jsonb_array_elements(pg_user_roles)
      LOOP
      IF db_role::text = readwriteRole::text
      THEN
        RAISE NOTICE 'GRANT USAGE ON SCHEMA % TO %', db_user->>'username'::text, db_role::text;
        EXECUTE FORMAT('GRANT USAGE on SCHEMA %s TO %s', db_user->>'username'::text, db_role::text);

        RAISE NOTICE 'ALTER DEFAULT PRIVILEGES IN SCHEMA % GRANT SELECT ON TABLES TO %', db_user->>'username'::text, db_role::text;
        EXECUTE FORMAT('ALTER DEFAULT PRIVILEGES IN SCHEMA %s GRANT ALL PRIVILEGES ON TABLES TO %s', db_user->>'username'::text, db_role::text);
      END IF;
      IF db_role::text = readonlyRole::text
      THEN
        RAISE NOTICE 'ALTER DEFAULT PRIVILEGES IN SCHEMA % GRANT SELECT ON TABLES TO %', db_user->>'username'::text, db_role::text;
        EXECUTE FORMAT('ALTER DEFAULT PRIVILEGES IN SCHEMA %s GRANT SELECT ON TABLES TO %s', db_user->>'username'::text, db_role::text);
      END IF;
    END LOOP;
  END LOOP;
END
$$;

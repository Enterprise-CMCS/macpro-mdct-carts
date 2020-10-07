-- Create Users assign credentials; Create Schemas, Roles, and assign Roles
SET pg.users = '${PG_USERS}';

DO $$
DECLARE
  pg_users JSONB = current_setting('pg.users');
  db_user JSONB;

  pg_user_roles JSONB;
  db_role JSONB;
BEGIN
  -- Creating Users and Schemas
  FOR db_user IN SELECT * FROM jsonb_array_elements(pg_users)
  LOOP
    BEGIN
      -- Creating User
      RAISE NOTICE 'CREATE USER %', db_user->>'username'::text;
      EXECUTE FORMAT('CREATE USER %s WITH PASSWORD ''%s''', db_user->>'username'::text, db_user->>'password'::text);
      EXCEPTION WHEN DUPLICATE_OBJECT THEN
      RAISE NOTICE 'not creating user % -- it already exists', db_user->>'username';
    END;
    -- Update user password
    EXECUTE FORMAT('ALTER USER %s WITH PASSWORD ''%s''', db_user->>'username'::text, db_user->>'password'::text);
    -- Creating Schema
    EXECUTE FORMAT ('CREATE SCHEMA IF NOT EXISTS %s AUTHORIZATION %s', db_user->>'username'::text, db_user->>'username'::text);

    -- Roles
    pg_user_roles = db_user->>'roles'::text;
    FOR db_role IN SELECT * FROM jsonb_array_elements(pg_user_roles)
      LOOP
      -- Creating each role
      RAISE NOTICE 'CREATE ROLE %', db_role::text;
      BEGIN
        EXECUTE FORMAT('CREATE ROLE %s', db_role::text);
        EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'not creating role % -- it already exists', db_role;
      END;
      -- Assigning each role
      RAISE NOTICE 'GRANT % TO %', db_role::text, db_user->>'username'::text;
      EXECUTE FORMAT('GRANT %s TO %s', db_role::text, db_user->>'username'::text);
    END LOOP;
  END LOOP;
END
$$;

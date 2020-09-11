DO $$
BEGIN
  CREATE ROLE ${PG_ROLE};
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'not creating role ${PG_ROLE} -- it already exists';
END
$$;

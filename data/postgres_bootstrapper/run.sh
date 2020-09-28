#!/bin/bash
source bin/build_script.sh

[ ! -d "${TARGET_SQL_DIR}" ] && mkdir $TARGET_SQL_DIR

SCHEMA_SCRIPTS=$( create_schema pg_schemas.sql )
[ $? != 0 ] && echo "An error occurred generating the pg_schemas.sql script." && exit 1

TABLESPACE_SCRIPTS=$( create_tablespaces pg_tablespaces.sql )
[ $? != 0 ] && echo "An error occurred generating the pg_tablespaces.sql script." && exit 1

GRANT_SCRIPTS=$( create_grants pg_grants.sql )
[ $? != 0 ] && echo "An error occurred generating the pg_grants.sql script." && exit 1

echo "Waiting for postgres..."

while ! nc -z $POSTGRES_HOST 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

chk_load=$(PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -t -w -c "select current_setting('db.load', true);")

if [ -z $chk_load ]
then
  # Create pg users and roles
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -f ${SCHEMA_SCRIPTS} -w

  # Create Tablespace
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -f ${TABLESPACE_SCRIPTS}

  # Download extracts from S3 bucket
  curl https://mdct-legacy-snapshot.s3.amazonaws.com/dev/pg_schip.dmp -o /app/pg_schip.dmp
  curl https://mdct-legacy-snapshot.s3.amazonaws.com/dev/pg_schipannualreports.dmp -o /app/pg_schipannualreports.dmp

  # Load seds data
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -w < /app/pg_schip.dmp

  # Load carts data
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -w < /app/pg_schipannualreports.dmp

  # Grant privileges to users, roles
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -f ${GRANT_SCRIPTS}

  # Set global variable after data load
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -t -w  << EOF
    SET db.load=1;
    ALTER SYSTEM SET db.load=1;
    SELECT pg_reload_conf();
EOF

fi

#rm -fr $TARGET_SQL_DIR

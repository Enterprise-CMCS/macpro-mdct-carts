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

CHK_LOAD=$(PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -t -w -c "select current_setting('db.load', true);")

if [ "${CHK_LOAD}" != "1" ]
then
  echo "Fresh instance, starting installation." 2>&1

  # Create pg users and roles
  echo "Creating users and roles..." 2>&1
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -f ${SCHEMA_SCRIPTS} -w

  # Create Tablespace
  echo "Creating tablespace..." 2>&1
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -f ${TABLESPACE_SCRIPTS}

  # Download extracts from S3 bucket
  curl https://mdct-legacy-snapshot.s3.amazonaws.com/dev/pg_mdct_extracts.tgz -o /app/pg_mdct_extracts.tgz
  # Unzip the dumps
  if [ -f /app/pg_mdct_extracts.tgz ] 
  then
    tar -xzvf /app/pg_mdct_extracts.tgz
  fi

  # Load seds data
  echo "Importing schip extract..." 2>&1
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -w < /app/pg_schip.dmp

  # Load carts data
  echo "Importing schipannualreports extract..." 2>&1
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -w < /app/pg_schipannualreports.dmp

  # Grant privileges to users, roles
  echo "Granting privileges to users, roles..." 2>&1
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -f ${GRANT_SCRIPTS}

  # Set global variable after data load
  echo "Set global variable." 2>&1
  PGPASSWORD=$POSTGRES_PASSWORD psql -d $POSTGRES_DB -h $POSTGRES_HOST -U $POSTGRES_USER -p 5432 -t -w  << EOF
    SET db.load=1;
    ALTER SYSTEM SET db.load=1;
    SELECT pg_reload_conf();
EOF

  echo "Finished." 2>&1
else
  echo "Existing installation present, noop." 2>&1
fi

rm -fr $TARGET_SQL_DIR
rm -fr *.tgz *.dmp

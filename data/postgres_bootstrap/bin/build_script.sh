#!/bin/bash
[ -z "$1" ] || [ -z "$2" ] && "Usage:  $0 [source_directory] [target_directory]" && exit 1;
SOURCE_SQL_DIR="${1}"
TARGET_SQL_DIR="${2}"

function create_schema {
  local FILENAME=pg_schemas.sql
  envsubst '$PG_USERS' < ${SOURCE_SQL_DIR}/${FILENAME} > ${TARGET_SQL_DIR}/${FILENAME}
  echo ${TARGET_SQL_DIR}/${FILENAME}
}

function create_tablespaces {
  local FILENAME=pg_tablespaces.sql
  envsubst '$PG_TABLESPACE,$PG_TABLESPACE_LOCATION,$PG_DATABASE' < ${SOURCE_SQL_DIR}/${FILENAME} > ${TARGET_SQL_DIR}/${FILENAME}
  echo ${TARGET_SQL_DIR}/${FILENAME}
}

function create_grants {
  local FILENAME=pg_grants.sql
  envsubst '$PG_USERS,$PG_TABLESPACE,$PG_RO_ROLE,$PG_RO_ROLE' < ${SOURCE_SQL_DIR}/${FILENAME} > ${TARGET_SQL_DIR}/${FILENAME}
  echo ${TARGET_SQL_DIR}/${FILENAME}
}

create_schema
create_tablespaces
create_grants

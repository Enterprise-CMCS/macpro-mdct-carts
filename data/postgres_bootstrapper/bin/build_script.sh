#!/bin/bash
SOURCE_SQL_DIR=sql_templates
TARGET_SQL_DIR=sql

function create_schema {
  local FILENAME=${1}
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

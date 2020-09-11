#!/bin/bash

function create_schema {
  local PG_SCHEMA
  for PG_SCHEMA in $(tr ',' '\n' <<< ${PG_SCHEMAS}); do
    export PG_SCHEMA
    envsubst '$PG_SCHEMA' < sql/create_schema.sql
  done
}

function revoke_database {
  local PG_DATABASE
  for PG_DATABASE in $(tr ',' '\n' <<< ${PG_DATABASES}); do
    export PG_DATABASE
    envsubst '$PG_DATABASE' < sql/revoke_database.sql
  done
}

function revoke_schema {
  local PG_SCHEMA
  for PG_SCHEMA in $(tr ',' '\n' <<< ${PG_SCHEMAS}); do
    export PG_SCHEMA
    envsubst '$PG_SCHEMA' < sql/revoke_schema.sql
  done
}

function create_role {
  local PG_ROLE=${PG_RO_ROLE}
  export PG_ROLE
  [ ! -z "${PG_ROLE}" ] && envsubst '$PG_ROLE' < sql/create_role.sql
  PG_ROLE=${PG_RW_ROLE}
  export PG_ROLE
  [ ! -z "${PG_ROLE}" ] && envsubst '$PG_ROLE' < sql/create_role.sql
}

function database_priv {
  local PG_DATABASE
  for PG_DATABASE in $(tr ',' '\n' <<< ${PG_DATABASES}); do
    export PG_DATABASE
    envsubst '$PG_DATABASE' < sql/database_priv.sql
  done
}

function schema_priv {
  local PG_SCHEMA
  export PG_RO_ROLE
  export PG_RW_ROLE
  for PG_SCHEMA in $(tr ',' '\n' <<< ${PG_SCHEMAS}); do
    export PG_SCHEMA
    envsubst '$PG_SCHEMA,$PG_RO_ROLE,$PG_RW_ROLE' < sql/schema_priv.sql
  done
}

function create_user {
  local PG_USER_REC
  for PG_USER_REC in $(tr ',' '\n' <<< ${PG_USERS}); do
    local PG_USER=$(cut -f1 -d'/' <<< ${PG_USER_REC})
    local PG_PASS=$(cut -f2 -d'/' <<< ${PG_USER_REC})
    [ -z "${PG_USER}" ] || [ -z "${PG_USER}" ] && echo "PG_USERS is misconfigured." && exit 1
    export PG_USER
    export PG_PASS
    envsubst '$PG_USER,$PG_PASS' < sql/create_user.sql
  done
}

function ro_user_priv {
  local PG_RO_USER
  for PG_RO_USER in $(tr ',' '\n' <<< ${PG_RO_USERS}); do
    export PG_RO_USER
    envsubst '$PG_RO_USER' < sql/ro_user_priv.sql
  done
}

function rw_user_priv {
  local PG_RW_USER
  for PG_RW_USER in $(tr ',' '\n' <<< ${PG_RW_USERS}); do
    export PG_RW_USER
    envsubst '$PG_RW_USER' < sql/rw_user_priv.sql
  done
}

create_schema
revoke_database
revoke_schema
create_role
database_priv
schema_priv
create_user
ro_user_priv
rw_user_priv

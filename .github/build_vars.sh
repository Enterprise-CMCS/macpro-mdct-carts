#!/bin/bash

var_list=(
  'AWS_ACCESS_KEY_ID'
  'AWS_SECRET_ACCESS_KEY'
  'AWS_DEFAULT_REGION'
  'STAGE_PREFIX'
#  'SLACK_WEBHOOK_URL'
#  'CODE_CLIMATE_ID'
  'BUILD_TAG'
  'VPC_NAME'
  'OIDC_CLIENT_ID'
  'OIDC_ISSUER'
  'TF_VAR_openid_discovery_url'
  'ECR_REPOSITORY_POSTGRESS_DEPLOYER'
  'ECR_REPOSITORY_API_POSTGRESS'
  'APPLICATION_BUCKET'
)

set_value() {
  varname=${1}
  if [ ! -z "${!varname}" ]; then
    echo "Setting $varname"
    echo "${varname}=${!varname}" >> $GITHUB_ENV
  fi
}

set_name() {
  varname=${1}
  echo "BRANCH_SPECIFIC_VARNAME_$varname=${branch_name//-/_}_$varname" >> $GITHUB_ENV
}

action=${1}

case "$1" in
set_names)
  for i in "${var_list[@]}"
  do
    set_name $i
  done
  ;;
set_values)
  for i in "${var_list[@]}"
  do
  	set_value $i
  done
  ;;
esac

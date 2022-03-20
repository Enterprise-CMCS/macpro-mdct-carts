#!/bin/bash

set -e

cd data/aws

stateBucket=${1}
workspace=${2}
action=${3}
varString1=${4}
varString1=${5}

#'application_versionenv.BUILD_TAG'
#'vpc_name=env.VPC_NAME'

# run terrafrom init
terraform init -backend-config="bucket=${stateBucket}" -input=false -reconfigure


# Select terraform workspace
if ! terraform workspace list | grep -q " ${workspace}\$" ; then
      terraform workspace new ${workspace}
    fi
    terraform workspace select ${workspace}


#Run terraform apply

terraform ${action} -var ${varString1} -var ${varString2} -input=false -auto-approve

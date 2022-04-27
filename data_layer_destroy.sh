#!/bin/bash

##Destroying data layer##

set -e



stateBucket=${1}
workspace=${2}
action=${3}
varString1=${4}
varString2=${5}


echo "$varString1"
echo "$varString2"


cd data/aws

terraform init -backend-config="bucket=${stateBucket}" -input=false -reconfigure

# Select terraform workspace
if ! terraform workspace list | grep -q " ${workspace}\$" ; then
      terraform workspace new ${workspace}
    fi
    terraform workspace select ${workspace}

#Run terraform apply
terraform ${action} -var "${varString1}" -var "${varString2}" -input=false -auto-approve
#terrform destroy -input=false -auto-approve

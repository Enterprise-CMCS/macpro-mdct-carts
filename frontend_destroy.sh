#!/bin/bash

##FRONT-END DEPLOYMENT##

set -e

#setting variables
stateBucket=${1}
workspace=${2}
action=${3}
varString1=${4}
varString2=${5}
varString3=${6}


##Initializing terraform
cd frontend/aws

terraform init -backend-config="bucket=${stateBucket}" -input=false -reconfigure

if ! terraform workspace list | grep -q " ${workspace}\$" ; then
      terraform workspace new ${workspace}
    fi
    terraform workspace select ${workspace}

#Run terraform apply
#terraform ${action} -var "${varString1}" -var "${varString2}" -input=false -auto-approve
terraform destroy  -input=false -auto-approve

#set frontend env variables from terraform output Files

#!/bin/bash

set -e



stateBucket=${1}
workspace=${2}
action=${3}
varString1=${4}
varString2=${5}


echo "$varString1"
echo "$varString2"

##DEPLOYING DATA LAYER##
cd data/aws

terraform init -backend-config="bucket=${stateBucket}" -input=false -reconfigure

# Select terraform workspace
if ! terraform workspace list | grep -q " ${workspace}\$" ; then
      terraform workspace new ${workspace}
    fi
    terraform workspace select ${workspace}

#Run terraform apply
terraform ${action} -var "${varString1}" -var "${varString2}" -input=false -auto-approve




##FRONT-END DEPLOYMENT##

cd frontend/aws

terraform init -backend-config="bucket=${stateBucket}" -input=false -reconfigure

if ! terraform workspace list | grep -q " ${workspace}\$" ; then
      terraform workspace new ${workspace}
    fi
    terraform workspace select ${workspace}

#Run terraform apply
terraform ${action} -var "${varString1}" -var "${varString2}" -input=false -auto-approve


#set frontend env variables from terraform output Files

#CLOUDFRONT_DISTRIBUTION_ID
#S3_BUCKET_NAME
#API_POSTGRES_UR
#PRINCE_API_ENDPOINT



#outputVar=(
#'cloudfront_distribution_id'
#'s3_bucket_name'
#'api_postgres_endpoint'
#'prince_api_endpoint'
#)

#for i in "${outputVar[@]}"
#do
#	terraform output $i
#done

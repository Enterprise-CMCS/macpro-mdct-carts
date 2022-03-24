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
terraform ${action} -var "${varString1}" -var "${varString2}" -input=false -auto-approve


#set frontend env variables from terraform output Files

CLOUDFRONT_DISTRIBUTION_ID=$(terraform output cloudfront_distribution_id)
S3_BUCKET_NAME=$(terraform output s3_bucket_name)
API_POSTGRES_UR=$(terraform output api_postgres_endpoint)
PRINCE_API_ENDPOINT=$(terraform output prince_api_endpoint)


#download and unzip artifacts from s3
aws s3 cp s3://${stateBucket}/artifacts/${varString3}/cartsbuild.tar.gz cartsbuild.tar.gz
tar -xvzf cartsbuild.tar.gz
#Populate the static archive with the API_POSTGRES_URL before you sync it to the host bucket
cd build && ./env.sh  && cd ..
aws s3 sync build s3://${S3_BUCKET_NAME}
# Cloudfront cache invalidation
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"

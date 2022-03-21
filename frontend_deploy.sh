#!/bin/bash

##FRONT-END DEPLOYMENT##



set -e



stateBucket=${1}
workspace=${2}
action=${3}
varString1=${4}
varString2=${5}
varString3=${6}


#echo "$varString1"
#echo "$varString2"
#echo "$varString3"

cd frontend/aws


terraform init -backend-config="bucket=${stateBucket}" -input=false -reconfigure

if ! terraform workspace list | grep -q " ${workspace}\$" ; then
      terraform workspace new ${workspace}
    fi
    terraform workspace select ${workspace}

#Run terraform apply
terraform ${action} -var "${varString1}" -var "${varString2}" -input=false -auto-approve


#set frontend env variables from terraform output Files
distribution_id=$(terraform output cloudfront_distribution_id)
bucket_name=$(terraform output s3_bucket_name)
postgres_endpoint=$(terraform output api_postgres_endpoint)
api_endpoint=$(terraform output prince_api_endpoint)



CLOUDFRONT_DISTRIBUTION_ID=${distribution_id}
S3_BUCKET_NAME=${bucket_name}
API_POSTGRES_UR=${postgres_endpoint}
PRINCE_API_ENDPOINT=${api_endpoint}



aws s3 cp s3://${stateBucket}/artifacts/${varString3}/cartsbuild.tar.gz cartsbuild.tar.gz
tar -xvzf cartsbuild.tar.gz
#Populate the static archive with the API_POSTGRES_URL before you sync it to the host bucket
cd build  && ./env.sh  && cd ..
aws s3 sync build s3://${S3_BUCKET_NAME}
# Cloudfront cache invalidation
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"



#outputVar=(
#'cloudfront_distribution_id'
#'s3_bucket_name'
#'api_postgres_endpoint'
#'prince_api_endpoint'
#)

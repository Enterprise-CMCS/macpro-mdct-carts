#!/bin/bash
set -e

if [[ $1 == "" ]] ; then
    echo 'ERROR:  You must pass a stage to destroy.  Ex. sh destroy.sh my-stage-name'
    exit 1
fi
stage=$1

#install jq
#sudo apt install jq -y
#install
#sudo apt install awscli -y
# A list of protected/important branches/environments/stages.
protected_stage_regex="(^master$|^val$|^production)"
if [[ $stage =~ $protected_stage_regex ]] ; then
    echo """
      ---------------------------------------------------------------------------------------------
      ERROR:  Please read below
      ---------------------------------------------------------------------------------------------
      The regex used to denote protected stages matched the stage name you passed.
      The regex holds names commonly used for important branches/environments/stages.
      This indicates you're trying to destroy a stage that you likely don't really want to destroy.
      Out of caution, this script will not continue.

      If you really do want to destroy $stage, modify this script as necessary and run again.

      Be careful.
      ---------------------------------------------------------------------------------------------
    """
    exit 1
fi
echo "\nCollecting information on stage $stage before attempting a destroy... This can take a minute or two..."

set -e

##Export aws credentials
export AWS_ACCESS_KEY_ID=$2
export AWS_SECRET_ACCESS_KEY=$3
export AWS_SESSION_TOKEN=$4

# Find cloudformation stacks associated with stage
stackList=(`aws cloudformation --region us-east-1 describe-stacks | jq -r ".Stacks[] | select(.Tags[] | select(.Key==\"STAGE\") | select(.Value==\"$stage\")) | .StackName"`)

# Find buckets attached to any of the stages, so we can empty them before removal.
bucketList=()
set +e
for i in "${stackList[@]}"
do
  buckets=(`aws cloudformation --region us-east-1 list-stack-resources --stack-name $i | jq -r ".StackResourceSummaries[] | select(.ResourceType==\"AWS::S3::Bucket\") | .PhysicalResourceId"`)
  echo $buckets
  for j in "${buckets[@]}"
  do
    # Sometimes a bucket has been deleted outside of CloudFormation; here we check that it exists.
    if aws s3api --region us-east-1 head-bucket --bucket $j > /dev/null 2>&1; then
      bucketList+=($j)
    fi
  done
done

echo """
********************************************************************************
- Check the following carefully -
********************************************************************************
"""

echo "The following buckets will be emptied"
printf '%s\n' "${bucketList[@]}"

echo "The following stacks will be destroyed:"
printf '%s\n' "${stackList[@]}"

for i in "${bucketList[@]}"
do
  echo $i
  set -e

  # Suspend bucket versioning.
  aws s3api --region us-east-1 put-bucket-versioning --bucket $i --versioning-configuration Status=Suspended

  # Remove all bucket versions.
  versions=`aws s3api --region us-east-1 list-object-versions \
    --bucket "$i" \
    --output=json \
    --query='{Objects: Versions[].{Key:Key,VersionId:VersionId}}'`
  if ! echo $versions | grep -q '"Objects": null'; then
    aws s3api --region us-east-1 delete-objects \
      --bucket $i \
      --delete "$versions" > /dev/null 2>&1
  fi

  # Remove all bucket delete markers.
  markers=`aws s3api --region us-east-1 list-object-versions \
    --bucket "$i" \
    --output=json \
    --query='{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId} }'`
  if ! echo $markers | grep -q '"Objects": null'; then
    aws s3api --region us-east-1 delete-objects \
      --bucket $i \
      --delete "$markers" > /dev/null 2>&1
  fi

  # Empty the bucket
  aws s3 --region us-east-1 rm s3://$i/ --recursive
done

# Trigger a delete for each cloudformation stack
for i in "${stackList[@]}"
do
  echo $i
  aws cloudformation --region us-east-1 delete-stack --stack-name $i
done

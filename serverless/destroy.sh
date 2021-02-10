#!/bin/bash
set -e

echo """
ERROR:  This destroy script has been disabled for CARTS.

Due to the fact that CARTS operates in a crowded AWS account, we do not feel
comfortable automating the tear down of multiple cloudformation stacks.
The destroy script is specific in what it cleans up, however, there could be
something in existence that could be tagged in a way that would cause problems.

If you want to destroy a stage, you will need to do so manually.  Open this file,
comment out this message, and run the script.
The script will print out every bucket and Cloudformation stack that it will destroy.
Review it carefully, and proceed or eject.

Thanks
"""
exit 1

if [[ $1 == "" ]] ; then
    echo 'ERROR:  You must pass a stage to destroy.  Ex. sh destroy.sh my-stage-name'
    exit 1
fi
stage=$1

# A list of names commonly used for protected/important branches/environments/stages.
# Update as appropriate.
protected_stage_regex="(^develop$|^master$|^main$|^val$|^impl$|^production$|^prod$|prod)"
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

ssmParamList=(
  /bigmac-config-$stage/mskConfigurationArn
  /bigmac-$stage/bootstrapBrokerStringTls
  /bigmac-$stage/clusterArn
  /bigmac-$stage/zookeeperConnectString
)
filteredSsmParamList=()
set +e
for i in "${ssmParamList[@]}"
do
  paramName=`aws ssm describe-parameters --filter "Key=Name,Values=$i" --query Parameters[0].Name --output text`
  if [ "$paramName" != "None" ]; then
    filteredSsmParamList+=($i)
  fi
done
set -e

# Find buckets associated with stage
# Unfortunately, I can't get all buckets and all associaged tags in a single CLI call (that I know of)
# So this can be pretty slow, depending on how many buckets exist in the account
# We get all bucket names, then find associated tags for each one-by-one
bucketList=(`aws s3api list-buckets --output text --query 'Buckets[*].Name'` )
filteredBucketList=()
set +e
for i in "${bucketList[@]}"
do
  stage_tag=`aws s3api get-bucket-tagging --bucket $i --output text --query 'TagSet[?Key==\`STAGE\`].Value' 2>/dev/null`
  if [ "$stage_tag" == "$stage" ]; then
    filteredBucketList+=($i)
  fi
done
set -e

# Find cloudformation stacks associated with stage
filteredStackList=(`aws cloudformation describe-stacks | jq -r ".Stacks[] | select(.Tags[] | select(.Key==\"STAGE\") | select(.Value==\"$stage\")) | .StackName"`)


echo """
********************************************************************************
- Check the following carefully -
********************************************************************************
"""

echo "The following SSM Parameters will be deleted"
printf '%s\n' "${filteredSsmParamList[@]}"
printf '\n'

echo "The following buckets will be emptied"
printf '%s\n' "${filteredBucketList[@]}"

echo "\nThe following stacks will be destroyed:"
printf '%s\n' "${filteredStackList[@]}"

echo """
********************************************************************************
- Scroll up and check carefully -
********************************************************************************
"""
if [ "$CI" != "true" ]; then
  read -p "Do you wish to continue?  Re-enter the stage name to continue:  " -r
  echo
  if [[ ! $REPLY == "$stage" ]]
  then
      echo "Stage name not re-entered.  Doing nothing and exiting."
      exit 1
  fi
fi

for i in "${filteredSsmParamList[@]}"
do
  echo $i
  aws ssm delete-parameter --name "$i"
done

for i in "${filteredBucketList[@]}"
do
  echo $i
  aws s3 rm s3://$i/ --recursive
done


for i in "${filteredStackList[@]}"
do
  echo $i
  aws cloudformation delete-stack --stack-name $i
done

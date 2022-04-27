#!/bin/bash

##Test Workflow Deployment##

set -e

##Initializing terraform
#pushd frontend/aws
cd frontend/aws
#set application_endpoint env variables from terraform output Files
APPLICATION_ENDPOINT=$(terraform output -json application_endpoint | jq -r .)

cd ../..

cd tests

set -e
docker run --rm -e APPLICATION_ENDPOINT=$APPLICATION_ENDPOINT -v $(pwd)/testcafe:/tests testcafe/testcafe chromium /tests/**/*.js

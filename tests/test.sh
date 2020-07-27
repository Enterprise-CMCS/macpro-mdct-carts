#!/bin/bash

set -e

docker build ./testcafe -t loaded_testcafe --build-arg application_endpoint=http://localhost

docker run --rm --network="data_net" --name test -e APPLICATION_ENDPOINT=http://react loaded_testcafe chromium /tests/**/*.js

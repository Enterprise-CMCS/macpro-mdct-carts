#!/bin/bash
set -e

curl -s get.sdkman.io | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install groovy
groovy -version


cd .jenkins/groovy
groovy -version
jenkinsUtils.buildAndPushImageToEcr("data/postgres_deployer", "postgres_deployer", env.BRANCH_NAME)
jenkinsUtils.buildAndPushImageToEcr("frontend/api_postgres", "postgres_django", [env.BUILD_TAG, env.BRANCH_NAME])

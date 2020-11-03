#!/usr/bin/env groovy

void buildAndPushImageToEcr(String buildDir, String repositoryName, List tags) {
  loginToEcr()
  imageUri = getEcrRepoUri(repositoryName)
  tagString = ""
  tags.each {
    tagString += "-t $imageUri:$it "
  }
  sh "docker build $tagString $buildDir"
  tags.each {
    sh "docker push $imageUri:$it"
  }
}

void triggerEcrScan(String repositoryName, String tag) {
  loginToEcr()
  sh """
    # There is a 1 scan/image/day limit.  We will start a scan, but ignore failures, as we may have already requested a scan.
    # If a scan is already complete, we're happy.  We will just fetch those results.  So ignoring failure is deemed OK.
    aws ecr start-image-scan --repository-name $repositoryName --image-id imageTag=$tag | true
  """
}

void fetchEcrScanResult(String repositoryName, String tag) {
  loginToEcr()
  sh """
    aws ecr wait image-scan-complete --repository-name $repositoryName --image-id imageTag=$tag
    aws ecr describe-image-scan-findings --repository-name $repositoryName --image-id imageTag=$tag --output json | tee ecr_scan_result_${repositoryName}.json >/dev/null
  """
}

void loginToEcr() {
  sh """
    set +x
    # Check the aws cli version
    if aws --version | grep aws-cli/2 ; then
      aws ecr get-login-password \
        --region us-east-1 \
      | docker login \
        --username AWS \
        --password-stdin `aws sts get-caller-identity | jq -r .Account`.dkr.ecr.us-east-1.amazonaws.com
    else
      eval \$(aws ecr get-login --region us-east-1 --no-include-email)
    fi
    set -x
  """
}

void installAwsCli() {
  sh '''
    pip install --user --upgrade awscli >/dev/null
    if [ -z "${AWS_REGION}" ]; then AWS_REGION=`curl --silent http://169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region`; fi
    aws configure set region $AWS_REGION
    aws configure set output json
  '''
}

void installEcsCli() {
  sh '''
    curl -Lo ~/.local/bin/ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest
    chmod +x ~/.local/bin/ecs-cli
  '''
}

void installTerraform(String version) {
  sh """
    curl -O https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_amd64.zip
    unzip -o ./terraform_${version}_linux_amd64.zip -d ~/.local/bin/ && rm ./terraform_${version}_linux_amd64.zip
  """
}

def getEcrRepoUri(String repoName) {
  sh(script: "aws ecr describe-repositories --no-paginate --query 'repositories'[0].repositoryUri --output text --repository-names $repoName", returnStdout: true).trim()
}

def getChangesSinceLastSuccessfulBuild() {
    def changes = []
    def build = currentBuild
    while (build != null && build.result != 'SUCCESS') {
        changes += (build.changeSets.collect { changeSet ->
            (changeSet.items.collect { item ->
                (item.affectedFiles.collect { affectedFile ->
                    affectedFile.path
                }).flatten()
            }).flatten()
        }).flatten()
        build = build.previousBuild
    }
    return changes.unique()
}


def pathHasChanges(path) {
  changes = getChangesSinceLastSuccessfulBuild()
  if(changes == []) {
    // No successful build exists, possibly the first run of the build.
    return true
  } else {
    changes.add(0, " ")
    changes = changes.join(" ")
    path = " " + path
    if(changes.contains(path)){
      return true
    } else {
      return false
    }
  }
}

void terraformInit(String stateBucket) {
  sh """
    PATH=~/.local/bin:$PATH
    terraform init -backend-config="bucket=${stateBucket}" -input=false
  """
}

void terraformSelectWorkspace(String workspace) {
  sh """
    PATH=~/.local/bin:$PATH
    if ! terraform workspace list | grep -q " ${workspace}\$" ; then
      terraform workspace new ${workspace}
    fi
    terraform workspace select ${workspace}
  """
}

void terraformApply(String stateBucket, String workspace, String action, Map tfvars) {
  terraformInit(stateBucket)
  terraformSelectWorkspace(workspace)
  varString = ""
  tfvars.each { k, v -> varString += " -var " + k + "=" + v }
  sh """
    PATH=~/.local/bin:$PATH
    terraform $action ${varString} -input=false -auto-approve
  """
}

def terraformOutput(String stateBucket, String workspace, String outputVar) {
  terraformInit(stateBucket)
  terraformSelectWorkspace(workspace)
  sh(script: "~/.local/bin/terraform output ${outputVar}", returnStdout: true).trim()
}

void runInspecScan(String name, String taskDef, String cluster, String subnets, String securityGroup){
  sh """
    PATH=~/.local/bin:$PATH
    taskArn=`aws ecs run-task --task-definition ${taskDef} --cluster ${cluster} --count 1 --network-configuration "awsvpcConfiguration={subnets=[${subnets}],securityGroups=[${securityGroup}],assignPublicIp=DISABLED}" --capacity-provider-strategy "capacityProvider=FARGATE" --output text --query 'tasks[0].taskArn'`
    taskId=`echo \$taskArn | sed 's|.*/||'`
    aws ecs wait tasks-stopped --cluster ${cluster} --tasks "\$taskArn"
    ecs-cli logs --task-id \$taskId --task-def ${taskDef} --cluster ${cluster} | sed -n '/BEGIN_JSON_RESULTS/,/END_JSON_RESULTS/p' | sed 's/BEGIN_JSON_RESULTS//' | sed 's/END_JSON_RESULTS//'  | tr -d '\r\n' | tr -d '\n' | python -m json.tool > inspec_scan_result_${name}.json
  """
}

return this

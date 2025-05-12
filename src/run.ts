/* eslint-disable no-console */
import yargs from "yargs";
import * as dotenv from "dotenv";
import LabeledProcessRunner from "./runner.js";
// import { ServerlessStageDestroyer } from "@stratiformdigital/serverless-stage-destroyer";
import { ServerlessStageDestroyer } from "./serverless-stage-destroyer.js";
import {
  getAllStacksForStage,
  getCloudFormationTemplatesForStage,
} from "./getCloudFormationTemplateForStage.js";
import { execSync } from "child_process";
import { addSlsBucketPolicies } from "./slsV4BucketPolicies.js";
import readline from "node:readline";
import {
  CloudFormationClient,
  DeleteStackCommand,
  DescribeStackResourceCommand,
  DescribeStacksCommand,
  waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";
/*
 * import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
 * import { writeLocalUiEnvFile } from "./write-ui-env-file.js";
 */
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

// load .env
dotenv.config();

const deployedServices = [
  "database",
  "uploads",
  "app-api",
  "ui",
  "ui-auth",
  "ui-src",
];

const project = process.env.PROJECT;
const region = process.env.REGION_A;

async function confirmDestroyCommand(stack: string) {
  const orange = "\x1b[38;5;208m";
  const reset = "\x1b[0m";

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = async (message: string) => {
    return new Promise((resolve) => {
      rl.question(message, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  };

  const confirmation = await question(`
${orange}********************************* STOP *******************************
You've requested a destroy for:

    ${stack}

Continuing will irreversibly delete all data and infrastructure
associated with ${stack} and its nested stacks.

Do you really want to destroy it?
Re-enter the stack name (${stack}) to continue:
**********************************************************************${reset}
`);

  if (confirmation !== stack) {
    throw new Error(`
${orange}**********************************************************************
The destroy operation has been aborted.
**********************************************************************${reset}
`);
  }
}

// Function to update .env files using 1Password CLI
function updateEnvFiles() {
  try {
    execSync("op inject --in-file .env.tpl --out-file .env --force", {
      stdio: "inherit",
    });

    execSync(
      "op inject -i services/ui-src/.env.tpl -o services/ui-src/.env -f",
      { stdio: "inherit" }
    );
    execSync("sed -i '' -e 's/# pragma: allowlist secret//g' .env");
    execSync(
      "sed -i '' -e 's/# pragma: allowlist secret//g' services/ui-src/.env"
    );
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to update .env files using 1Password CLI.");
    process.exit(1);
  }
}

// run_db_locally runs the local db
async function run_db_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "db yarn",
    ["yarn", "install"],
    "services/database"
  );
  await runner.run_command_and_output(
    "db svls",
    ["serverless", "dynamodb", "install", "--stage", "local"],
    "services/database"
  );
  runner.run_command_and_output(
    "db",
    [
      "serverless",
      "offline",
      "start",
      "--stage",
      "local",
      "--lambdaPort",
      "3003",
    ],
    "services/database"
  );
}

// run_api_locally uses the serverless-offline plugin to run the api lambdas locally
async function run_api_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "api deps",
    ["yarn", "install"],
    "services/app-api"
  );
  runner.run_command_and_output(
    "api",
    [
      "serverless",
      "offline",
      "start",
      "--stage",
      "local",
      "--region",
      "us-east-1",
      "--httpPort",
      "3030",
    ],
    "services/app-api"
  );
}

// run_s3_locally runs s3 locally
async function run_s3_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "s3 yarn",
    ["yarn", "install"],
    "services/uploads"
  );
  runner.run_command_and_output(
    "s3",
    ["serverless", "s3", "start", "--stage", "local"],
    "services/uploads"
  );
}

/*
 * run_fe_locally runs the frontend and its dependencies locally
 * @ts-ignore
 */
async function run_fe_locally(runner: LabeledProcessRunner) {
  await runner.run_command_and_output(
    "ui deps",
    ["yarn", "install"],
    "services/ui-src"
  );
  await runner.run_command_and_output(
    "ui conf",
    ["./env.sh", "local"],
    "services/ui-src"
  );
  /*
   * const apiUrl = await getCloudFormationStackOutputValue(
   *   "carts-localstack",
   *   "ApiUrl"
   * );
   */

  // await writeLocalUiEnvFile(apiUrl!);

  runner.run_command_and_output("ui", ["npm", "start"], "services/ui-src");
}

// run_all_locally runs all of our services locally
async function run_all_locally() {
  const runner = new LabeledProcessRunner();

  run_db_locally(runner);
  run_s3_locally(runner);
  run_api_locally(runner);
  run_fe_locally(runner);
}

async function deploy_kafka_service(
  runner: LabeledProcessRunner,
  stage: string
) {
  const kafkaservice = "carts-bigmac-streams";
  await install_deps(runner, kafkaservice);
  const kafkaDeployCmd = ["sls", "deploy", "--stage", stage];
  await runner.run_command_and_output(
    "Kafka service deploy",
    kafkaDeployCmd,
    `services/${kafkaservice}`
  );
}

async function install_deps(runner: LabeledProcessRunner, service: string) {
  await runner.run_command_and_output(
    "Installing Dependencies",
    ["yarn", "install", "--frozen-lockfile"],
    `services/${service}`
  );
}

async function deploy(options: { stage: string }) {
  checkEnvVars();
  const stage = options.stage;
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);
  const deployCmd = ["sls", "deploy", "--stage", stage];
  await runner.run_command_and_output("SLS Deploy", deployCmd, ".");
  await addSlsBucketPolicies();
  // Only deploy resources for kafka ingestion in real envs
  if (stage === "main" || stage === "val" || stage === "production") {
    await deploy_kafka_service(runner, stage);
  }
}

async function checkRetainedResources(
  stage: string,
  filters: { Key: string; Value: string }[] | undefined
) {
  const cfnClient = new CloudFormationClient({ region: process.env.REGION_A });

  const templates = await getCloudFormationTemplatesForStage(
    `${process.env.REGION_A}`,
    stage,
    filters
  );

  const resourcesToCheck = {
    [`database-${stage}`]: [
      "AcsTable",
      "FmapTable",
      "StateTable",
      "StateStatusTable",
      "SectionTable",
      "SectionBaseTable",
      "StageEnrollmentCountsTable",
      "UploadsTable",
    ],
    [`ui-${stage}`]: [
      "CloudFrontDistribution",
      "LoggingBucket",
      "LoggingBucketPolicy",
      "WaflogsUploadBucket",
      "WaflogsUploadBucketPolicy",
    ],
    [`uploads-${stage}`]: [
      "AttachmentsBucket",
      "AttachmentsBucketPolicy",
      "FiscalYearTemplateBucket",
      "FiscalYearTemplateBucketPolicy",
    ],
    [`ui-auth-${stage}`]: ["CognitoUserPool"],
  };

  const notRetained: { templateKey: string; resourceKey: string }[] = [];
  const retained: {
    templateKey: string;
    resourceKey: string;
    physicalResourceId: string;
  }[] = [];

  for (const [templateKey, resourceKeys] of Object.entries(resourcesToCheck)) {
    for (const resourceKey of resourceKeys) {
      const policy =
        templates?.[templateKey]?.Resources?.[resourceKey]?.DeletionPolicy;
      if (policy === "Retain") {
        const describeCmd = new DescribeStackResourceCommand({
          StackName: templateKey,
          LogicalResourceId: resourceKey,
        });
        const response = await cfnClient.send(describeCmd);
        const physicalResourceId =
          response.StackResourceDetail!.PhysicalResourceId!;
        retained.push({ templateKey, resourceKey, physicalResourceId });
      } else {
        notRetained.push({ templateKey, resourceKey });
      }
    }
  }

  return { retained, notRetained };
}

function checkEnvVars() {
  const envVarsToCheck = [
    "SKIP_PREFLIGHT_CHECK",
    "LOCAL_LOGIN",
    "attachmentsBucketName",
    "fiscalYearTemplateBucketName",
    "loggingBucket",
    "acsTableName",
    "fmapTableName",
    "uploadsTableName",
    "stateTableName",
    "stateStatusTableName",
    "sectionBaseTableName",
    "sectionTableName",
    "stageEnrollmentCountsTableName",
    "DYNAMODB_URL",
    "COGNITO_USER_POOL_ID",
    "COGNITO_USER_POOL_CLIENT_ID",
    "POST_SIGNOUT_REDIRECT",
    "API_URL",
    "S3_LOCAL_ENDPOINT",
    "S3_ATTACHMENTS_BUCKET_NAME",
    "docraptorApiKey",
    "iamPath",
    "iamPermissionsBoundary",
    "SLS_INTERACTIVE_SETUP_ENABLE",
    "CYPRESS_ADMIN_USER_EMAIL",
    "CYPRESS_ADMIN_USER_PASSWORD",
    "CYPRESS_STATE_USER_EMAIL",
    "CYPRESS_STATE_USER_PASSWORD",
    "LOGGING_BUCKET",
  ];

  const setVars = envVarsToCheck.filter(
    (name) => process.env[name] !== undefined
  );

  if (setVars.length > 0) {
    const message = `Will not proceed because these environment variables are set:\n${setVars.join(
      ", "
    )}\ncheck your .env file`;

    throw message;
  }
}

async function getAccountId() {
  const client = new STSClient({ region: process.env.REGION_A });
  const identity = await client.send(new GetCallerIdentityCommand({}));
  return identity.Account;
}

async function destroy_stage(options: {
  stage: string;
  service: string | undefined;
  wait: boolean;
  verify: boolean;
}) {
  checkEnvVars();

  let destroyer = new ServerlessStageDestroyer();
  let filters = [
    {
      Key: "PROJECT",
      Value: `${process.env.PROJECT}`,
    },
  ];
  if (options.service) {
    filters.push({
      Key: "SERVICE",
      Value: `${options.service}`,
    });
  }

  const stacks = await getAllStacksForStage(
    `${process.env.REGION_A}`,
    options.stage,
    filters
  );

  const protectedStacks = stacks
    .filter((i: any) => i.EnableTerminationProtection)
    .map((i: any) => i.StackName);

  if (protectedStacks.length > 0) {
    console.log(
      `We cannot proceed with the destroy because the following stacks have termination protection enabled:\n${protectedStacks.join(
        "\n"
      )}`
    );
    return;
  } else {
    console.log(
      "No stacks have termination protection enabled. Proceeding with the destroy."
    );
  }

  let notRetained: { templateKey: string; resourceKey: string }[] = [];
  let retained;
  if (["main", "master", "val", "production"].includes(options.stage)) {
    ({ retained, notRetained } = await checkRetainedResources(
      options.stage,
      filters
    ));
  }

  if (retained) {
    console.log("Information to use for import to CDK:");
    retained.forEach(({ templateKey, resourceKey, physicalResourceId }) => {
      // WaflogsUploadBucket is being retained but not being imported into CDK.
      if (resourceKey !== "WaflogsUploadBucket") {
        console.log(`${templateKey} - ${resourceKey} - ${physicalResourceId}`);
      }
    });
  }

  if (notRetained.length > 0) {
    console.log(
      "Will not destroy the stage because it's an important stage and some important resources are not yet set to be retained:"
    );
    notRetained.forEach(({ templateKey, resourceKey }) =>
      console.log(` - ${templateKey}/${resourceKey}`)
    );
    return;
  }

  const accountId = await getAccountId();
  await destroyer.destroy(`${process.env.REGION_A}`, options.stage, {
    wait: options.wait,
    filters: filters,
    verify: options.verify,
    bucketsToSkip: [
      `ui-${options.stage}-cloudfront-logs-${accountId}`,
      `${accountId}-ui-${options.stage}-waflogs`,
      `uploads-${options.stage}-attachments-${accountId}`,
      `uploads-${options.stage}-carts-download-${accountId}`,
    ],
  });
}

async function run_cdk_watch(
  runner: LabeledProcessRunner,
  options: { stage: string }
) {
  await runner.run_command_and_output(
    "CDK watch",
    [
      "yarn",
      "cdk",
      "watch",
      "--context",
      `stage=${options.stage}`,
      "--no-rollback",
    ],
    "."
  );
}

function isColimaRunning() {
  try {
    const output = execSync("colima status 2>&1", {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();
    return output.includes("running");
  } catch {
    return false;
  }
}

function isLocalStackRunning() {
  try {
    return execSync("localstack status", {
      encoding: "utf-8",
      stdio: "pipe",
    }).includes("running");
  } catch {
    return false;
  }
}

async function run_watch_cdk(options: { stage: string }) {
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);

  run_cdk_watch(runner, options);
  run_fe_locally(runner);
}

/*
 * async function getCloudFormationStackOutputValue(
 *   stackName: string,
 *   outputName: string
 * ) {
 *   const cloudFormationClient = new CloudFormationClient({ region });
 *   const command = new DescribeStacksCommand({ StackName: stackName });
 *   const response = await cloudFormationClient.send(command);
 *   return response.Stacks?.[0]?.Outputs?.find(
 *     (output) => output.OutputKey === outputName
 *   )?.OutputValue;
 * }
 */

async function run_local_cdk() {
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);

  if (!isColimaRunning()) {
    throw "Colima needs to be running.";
  }

  if (!isLocalStackRunning()) {
    throw "LocalStack needs to be running.";
  }

  process.env.AWS_DEFAULT_REGION = "us-east-1";
  process.env.AWS_ACCESS_KEY_ID = "localstack";
  process.env.AWS_SECRET_ACCESS_KEY = "localstack"; // pragma: allowlist secret
  process.env.AWS_ENDPOINT_URL = "http://localhost:4566";

  await runner.run_command_and_output(
    "CDK local bootstrap",
    [
      "yarn",
      "cdklocal",
      "bootstrap",
      "aws://000000000000/us-east-1",
      "--context",
      "stage=bootstrap",
    ],
    "."
  );

  await runner.run_command_and_output(
    "CDK local local-prerequisite deploy",
    [
      "yarn",
      "cdklocal",
      "deploy",
      "--context",
      "stage=prerequisites",
      "--app",
      '"npx tsx deployment/local/prerequisites.ts"',
    ],
    "."
  );

  await runner.run_command_and_output(
    "CDK local prerequisite deploy",
    [
      "yarn",
      "cdklocal",
      "deploy",
      "--context",
      "stage=prerequisites",
      "--app",
      '"npx tsx deployment/prerequisites.ts"',
    ],
    "."
  );

  await runner.run_command_and_output(
    "CDK local deploy",
    [
      "yarn",
      "cdklocal",
      "deploy",
      "--context",
      "stage=localstack",
      "--all",
      "--no-rollback",
    ],
    "."
  );

  /*
   * const seedDataFunctionName = await getCloudFormationStackOutputValue(
   *   "carts-localstack",
   *   "SeedDataFunctionName"
   * );
   */

  /*
   * const lambdaClient = new LambdaClient({ region: "us-east-1" });
   * const lambdaCommand = new InvokeCommand({
   *   FunctionName: seedDataFunctionName,
   *   InvocationType: "Event",
   *   Payload: Buffer.from(JSON.stringify({})),
   * });
   * await lambdaClient.send(lambdaCommand);
   */

  runner.run_command_and_output(
    "CDK local watch",
    [
      "yarn",
      "cdklocal",
      "watch",
      "--context",
      "stage=localstack",
      "--no-rollback",
    ],
    "."
  );
  run_fe_locally(runner);
}

async function prepare_services(runner: LabeledProcessRunner) {
  for (const service of deployedServices) {
    await install_deps(runner, service);
  }
}

async function deploy_cdk_prerequisites() {
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);
  const deployPrequisitesCmd = [
    "yarn",
    "cdk",
    "deploy",
    "--app",
    '"npx tsx deployment/prerequisites.ts"',
  ];
  await runner.run_command_and_output(
    "CDK prerequisite deploy",
    deployPrequisitesCmd,
    "."
  );
}

const stackExists = async (stackName: string): Promise<boolean> => {
  const client = new CloudFormationClient({ region });
  try {
    await client.send(new DescribeStacksCommand({ StackName: stackName }));
    return true;
  } catch {
    return false;
  }
};

async function deploy_cdk(options: { stage: string }) {
  const runner = new LabeledProcessRunner();
  await prepare_services(runner);
  if (await stackExists("carts-prerequisites")) {
    await runner.run_command_and_output(
      "CDK deploy",
      [
        "yarn",
        "cdk",
        "deploy",
        "--context",
        `stage=${options.stage}`,
        "--method=direct",
        "--all",
      ],
      "."
    );
  } else {
    console.error(
      "MISSING PREREQUISITE STACK! Must deploy it before attempting to deploy the application."
    );
  }
}

const waitForStackDeleteComplete = async (
  client: CloudFormationClient,
  stackName: string
) => {
  return waitUntilStackDeleteComplete(
    { client, maxWaitTime: 3600 },
    { StackName: stackName }
  );
};

async function destroy_cdk({
  stage,
  wait,
  verify,
}: {
  stage: string;
  wait: boolean;
  verify: boolean;
}) {
  const stackName = `${project}-${stage}`;

  if (/prod/i.test(stage)) {
    console.log("Error: Destruction of production stages is not allowed.");
    process.exit(1);
  }

  if (verify) await confirmDestroyCommand(stackName);

  const client = new CloudFormationClient({ region });
  await client.send(new DeleteStackCommand({ StackName: stackName }));
  console.log(`Stack ${stackName} delete initiated.`);

  if (wait) {
    console.log(`Waiting for stack ${stackName} to be deleted...`);
    const result = await waitForStackDeleteComplete(client, stackName);
    console.log(
      result.state === "SUCCESS"
        ? `Stack ${stackName} deleted successfully.`
        : `Error: Stack ${stackName} deletion failed.`
    );
  } else {
    console.log(
      `Stack ${stackName} delete initiated. Not waiting for completion as --wait is set to false.`
    );
  }
}

/*
 * The command definitions in yargs
 * All valid arguments to dev should be enumerated here, this is the entrypoint to the script
 */
yargs(process.argv.slice(2))
  .command("local", "run system locally", {}, run_all_locally)
  .command(
    "watch-cdk",
    "run cdk watch and react together",
    { stage: { type: "string", demandOption: true } },
    run_watch_cdk
  )
  .command(
    "local-cdk",
    "run our app via cdk deployment to localstack locally and react locally together",
    {},
    run_local_cdk
  )
  .command(
    "deploy-cdk-prerequisites",
    "deploy the app's AWS account prerequisites with cdk to the cloud",
    () => {},
    deploy_cdk_prerequisites
  )
  .command(
    "deploy",
    "deploy the app with serverless compose to the cloud",
    { stage: { type: "string", demandOption: true } },
    deploy
  )
  .command(
    "destroy",
    "destroy serverless stage",
    {
      stage: { type: "string", demandOption: true },
      service: { type: "string", demandOption: false },
      wait: { type: "boolean", demandOption: false, default: true },
      verify: { type: "boolean", demandOption: false, default: true },
    },
    destroy_stage
  )
  .command(
    "local_cdk",
    "run our app via cdk deployment to localstack locally and react locally together",
    {},
    run_local_cdk
  )
  .command(
    "deploy_cdk",
    "deploy the app with cdk to the cloud",
    {
      stage: { type: "string", demandOption: true },
    },
    deploy_cdk
  )
  .command(
    "destroy_cdk",
    "destroy a cdk stage in AWS",
    {
      stage: { type: "string", demandOption: true },
      wait: { type: "boolean", demandOption: false, default: true },
      verify: { type: "boolean", demandOption: false, default: true },
    },
    destroy_cdk
  )
  .command(
    "update-env",
    "update environment variables using 1Password",
    () => {},
    updateEnvFiles
  )
  .scriptName("run")
  .strict()
  .demandCommand(1, "").argv; // this prints out the help if you don't call a subcommand

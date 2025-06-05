import { isLocalStack } from "./local/util";
import { getSecret } from "./utils/secrets-manager";

export interface DeploymentConfigProperties {
  brokerString: string;
  cloudfrontCertificateArn?: string;
  cloudfrontDomainName?: string;
  docraptorApiKey: string;
  isDev: boolean;
  kafkaAuthorizedSubnetIds: string;
  launchDarklyClient: string;
  oktaMetadataUrl: string;
  project: string;
  redirectSignout: string;
  secureCloudfrontDomainName?: string;
  stage: string;
  userPoolDomainPrefix?: string;
  vpcName: string;
  vpnIpSetArn?: string;
  vpnIpv6SetArn?: string;
  sedsTopic: string;
}

export const determineDeploymentConfig = async (stage: string) => {
  const project = process.env.PROJECT!;
  const isDev =
    isLocalStack ||
    ![
      "main",
      "val",
      "production",
      "<YOUR_BRANCH_NAME>",
      "jontester1",
      "jontester2",
      "jontester3",
    ].includes(stage);
  const secretConfigOptions = {
    ...(await loadDefaultSecret(project, stage)),
    ...(await loadStageSecret(project, stage)),
  };

  const config = {
    project,
    stage,
    isDev,
    ...secretConfigOptions,
  };
  if (config.cloudfrontDomainName) {
    config.secureCloudfrontDomainName = `https://${config.cloudfrontDomainName}/`;
  }

  if (stage !== "bootstrap") {
    validateConfig(config);
  }

  return config;
};

export const loadDefaultSecret = async (project: string, stage?: string) => {
  if (stage === "bootstrap") {
    return {};
  } else {
    return JSON.parse((await getSecret(`${project}-default`))!);
  }
};

const loadStageSecret = async (project: string, stage: string) => {
  const secretName = `${project}-${stage}`;
  try {
    return JSON.parse((await getSecret(secretName))!);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.warn(
      `Optional stage secret "${secretName}" not found: ${error.message}`
    );
    return {};
  }
};

function validateConfig(config: {
  [key: string]: any;
}): asserts config is DeploymentConfigProperties {
  const expectedKeys = [
    "brokerString",
    "docraptorApiKey",
    "kafkaAuthorizedSubnetIds",
    "launchDarklyClient",
    "oktaMetadataUrl",
    "project",
    "redirectSignout",
    "stage",
    "vpcName",
    "sedsTopic",
  ];

  const invalidKeys = expectedKeys.filter(
    (key) => !config[key] || typeof config[key] !== "string"
  );

  if (invalidKeys.length > 0) {
    throw new Error(
      `The following deployment config keys are missing or invalid: ${invalidKeys}`
    );
  }
}

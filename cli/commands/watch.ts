import { Argv } from "yargs";
import { checkIfAuthenticated } from "../lib/sts.js";
import { runCommand } from "../lib/runner.js";
import {
  runFrontendLocally,
  getCloudFormationStackOutputValues,
} from "../lib/utils.js";
import downloadClamAvLayer from "../lib/clam.js";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

export const watch = {
  command: "watch",
  describe: "run cdk watch and react together",
  builder: (yargs: Argv) => {
    return yargs.option("stage", { type: "string", demandOption: true });
  },
  handler: async (options: { stage: string }) => {
    checkIfAuthenticated();

    const seedDataFunctionName = (
      await getCloudFormationStackOutputValues(`carts-${options.stage}`)
    ).SeedDataFunctionName;

    const lambdaClient = new LambdaClient({ region: "us-east-1" });
    const lambdaCommand = new InvokeCommand({
      FunctionName: seedDataFunctionName,
      InvocationType: "Event",
      Payload: Buffer.from(JSON.stringify({})),
    });
    await lambdaClient.send(lambdaCommand);

    await Promise.all([
      await runCommand(
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
      ),
      await runFrontendLocally(options.stage),
    ]);
  },
};

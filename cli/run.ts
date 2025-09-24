import yargs from "yargs";
import "dotenv/config";
import { deploy } from "./commands/deploy.js";
import { deployPrerequisites } from "./commands/deploy-prerequisites.js";
import { destroy } from "./commands/destroy.js";
import { install, installDeps } from "./commands/install.js";
import { local } from "./commands/local.js";
import { updateEnv } from "./commands/update-env.js";
import { watch } from "./commands/watch.js";

await yargs(process.argv.slice(2))
  .middleware(async (argv) => {
    if (argv._.length > 0) {
      await installDeps();
    }
  })
  .command(deploy)
  .command(deployPrerequisites)
  .command(destroy)
  .command(install)
  .command(local)
  .command(updateEnv)
  .command(watch)
  .strict()
  .scriptName("run")
  .demandCommand(1, "")
  .parse();

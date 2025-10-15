import { runCommand } from "../lib/runner.js";

const directories = [
  "./services/database",
  "./services/app-api",
  "./services/ui",
  "./services/ui-auth",
  "./services/ui-src",
  "./services/carts-bigmac-streams",
];

export const installDeps = async () => {
  await runCommand(
    "yarn install root",
    ["yarn", "--silent", "install", "--frozen-lockfile"],
    ".",
    { quiet: true }
  );

  for (const dir of directories) {
    await runCommand(
      `yarn install ${dir}`,
      ["yarn", "--silent", "install", "--frozen-lockfile"],
      dir,
      { quiet: true }
    );
  }
};

export const install = {
  command: "install",
  describe: "install all project dependencies",
  handler: async () => {},
};

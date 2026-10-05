import { createHash } from "node:crypto";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  GetObjectCommand,
  S3Client,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { isLocalStack } from "../local/util.ts";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

export interface PrinceAssetMeta {
  version: string;
  sha256: string;
  url: string;
}

/** Pinned YesLogic Prince AWS Lambda package (update when bumping Prince). */
export const PRINCE_ASSET_META: PrinceAssetMeta = {
  version: "16.2",
  // Public download checksum — not a credential.
  sha256: "b936f8cf8cfb4d33b9a1630d94d0091d23cf23bfbefc347d8a7e08ebe62d79c7", // pragma: allowlist secret
  url: "https://www.princexml.com/download/prince-16.2-aws-lambda.zip",
};

export const PRINCE_LOCAL_DIR_REL = "services/app-api/bin/prince";
export const PRINCE_GENERATED_DIR_REL =
  "services/app-api/bin/.generated/prince";

export function loadPrinceAssetMeta(): PrinceAssetMeta {
  return PRINCE_ASSET_META;
}

export function princeAssetBucketName(
  project: string,
  account: string
): string {
  return `${project}-prince-assets-${account}`;
}

export function princeAssetObjectKey(
  version: string = loadPrinceAssetMeta().version
): string {
  return `prince/${version}/prince-${version}-aws-lambda.zip`;
}

/**
 * LocalStack: gitignored bin/prince (auto-fetches via fetch-prince-linux.sh if missing).
 * Cloud: S3 object verified against pinned SHA-256, extracted under .generated/.
 */
export async function resolvePrincePackageDir(
  project: string
): Promise<string> {
  if (isLocalStack) {
    return ensurePrinceLocal();
  }

  const account = process.env.CDK_DEFAULT_ACCOUNT;
  if (!account) {
    throw new Error(
      "CDK_DEFAULT_ACCOUNT is required to resolve the Prince assets bucket"
    );
  }

  return ensurePrinceFromS3(project, account);
}

/**
 * Ensure the Linux AWS Lambda Prince package exists under bin/prince for LocalStack.
 * Runs the fetch script on demand so shared cli/commands/local.ts stays untouched.
 */
function ensurePrinceLocal(): string {
  const localDir = join(REPO_ROOT, PRINCE_LOCAL_DIR_REL);
  const wrapper = join(localDir, "prince");
  if (!existsSync(wrapper)) {
    const fetchScript = join(REPO_ROOT, "scripts/fetch-prince-linux.sh");
    console.log(`Prince package missing at ${wrapper}; running ${fetchScript}`);
    execFileSync(fetchScript, {
      cwd: REPO_ROOT,
      stdio: "inherit",
    });
  }
  if (!existsSync(wrapper)) {
    throw new Error(
      `Missing Linux Prince at ${wrapper} after running scripts/fetch-prince-linux.sh`
    );
  }
  return PRINCE_LOCAL_DIR_REL;
}

async function ensurePrinceFromS3(
  project: string,
  account: string
): Promise<string> {
  const meta = loadPrinceAssetMeta();
  const destAbs = join(REPO_ROOT, PRINCE_GENERATED_DIR_REL);
  const markerPath = join(
    REPO_ROOT,
    "services/app-api/bin/.generated/prince.sha256"
  );
  const wrapperPath = join(destAbs, "prince");

  if (
    existsSync(wrapperPath) &&
    existsSync(markerPath) &&
    readFileSync(markerPath, "utf8").trim() === meta.sha256
  ) {
    return PRINCE_GENERATED_DIR_REL;
  }

  const bucket = princeAssetBucketName(project, account);
  const key = princeAssetObjectKey(meta.version);
  console.log(
    "Fetching Prince AWS Lambda zip from configured S3 asset location"
  );

  const client = new S3Client({ region: "us-east-1" });
  let response: GetObjectCommandOutput;
  try {
    response = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
  } catch (error: any) {
    throw new Error(
      `Failed to download Prince package from s3://${bucket}/${key}. ` +
        `Publish it once with ./scripts/publish-prince-asset.sh (${error.message})`
    );
  }

  if (!response.Body) {
    throw new Error(`Empty body for s3://${bucket}/${key}`);
  }

  const tmpDir = join(REPO_ROOT, "services/app-api/bin/.generated");
  mkdirSync(tmpDir, { recursive: true });
  const zipPath = join(tmpDir, `prince-${meta.version}-aws-lambda.zip`);

  await pipeline(
    response.Body as NodeJS.ReadableStream,
    createWriteStream(zipPath)
  );

  const zipBytes = readFileSync(zipPath);
  const digest = createHash("sha256").update(zipBytes).digest("hex");
  if (digest !== meta.sha256) {
    rmSync(zipPath, { force: true });
    throw new Error(
      `Prince zip SHA-256 mismatch for s3://${bucket}/${key}: expected ${meta.sha256}, got ${digest}`
    );
  }

  const unpackDir = join(tmpDir, `prince-unpack-${meta.version}`);
  rmSync(unpackDir, { recursive: true, force: true });
  mkdirSync(unpackDir, { recursive: true });
  execFileSync("unzip", ["-q", zipPath, "-d", unpackDir], { stdio: "inherit" });

  let srcDir = unpackDir;
  if (!existsSync(join(srcDir, "prince"))) {
    const entries = readdirSync(srcDir).filter((name) => !name.startsWith("."));
    if (
      entries.length === 1 &&
      existsSync(join(srcDir, entries[0], "prince"))
    ) {
      srcDir = join(srcDir, entries[0]);
    }
  }

  if (!existsSync(join(srcDir, "prince"))) {
    throw new Error(
      `Prince zip from s3://${bucket}/${key} missing ./prince after extract`
    );
  }

  rmSync(destAbs, { recursive: true, force: true });
  mkdirSync(destAbs, { recursive: true });
  execFileSync("bash", ["-lc", `cp -R "${srcDir}/." "${destAbs}/"`], {
    stdio: "inherit",
  });

  execFileSync("find", [destAbs, "-name", "*.cdx.json", "-delete"]);
  execFileSync("chmod", ["+x", join(destAbs, "prince")]);
  try {
    execFileSync("bash", [
      "-lc",
      `chmod +x "${destAbs}/prince-engine/bin"/prince*`,
    ]);
  } catch {
    // older layouts
  }

  writeFileSync(markerPath, `${meta.sha256}\n`, "utf8");
  rmSync(zipPath, { force: true });
  rmSync(unpackDir, { recursive: true, force: true });

  return PRINCE_GENERATED_DIR_REL;
}

const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const sort = require("sort-package-json");

async function main({ rootDirectory }) {
  const PACKAGE_JSON_PATH = path.join(rootDirectory, "package.json");
  const README_PATH = path.join(rootDirectory, "README.md");
  const GITIGNORE_PATH = path.join(rootDirectory, ".gitignore");
  const APPROOT_PATH = path.join(rootDirectory, "app/root.tsx");
  const APPINDEX_PATH = path.join(rootDirectory, "app/routes/index.tsx");
  const DOCKERCOMPOSE_PATH = path.join(rootDirectory, "docker-compose.yml");

  const DIR_NAME = path.basename(rootDirectory);

  const APP_NAME = DIR_NAME
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, "-");

  const [packageJson, readme, gitignore, appRoot, appIndex, dockerCompose] =
    await Promise.all([
      fs.readFile(PACKAGE_JSON_PATH, "utf-8"),
      fs.readFile(README_PATH, "utf-8"),
      fs.readFile(GITIGNORE_PATH, "utf-8"),
      fs.readFile(APPROOT_PATH, "utf-8"),
      fs.readFile(APPINDEX_PATH, "utf-8"),
      fs.readFile(DOCKERCOMPOSE_PATH, "utf-8"),
    ]);

  const newPackageJson =
    JSON.stringify(
      sort({
        ...JSON.parse(packageJson.replaceAll("REMIXAPP", APP_NAME)),
        name: APP_NAME,
      }),
      null,
      2
    ) + "\n";

  await Promise.all([
    /**
     * We treat the stack as a lib and don't include the lockfile in source control.
     * But when it is cloned, the stack becomes an application and thus _should explicitly_
     * enforce a lockfile, as it is best practice. These replacements achieve that.
     */
    fs.writeFile(
      GITIGNORE_PATH,
      gitignore.replace(/#<rm>(.|\n)*#<\/rm>\n/, "") +
        "\ndocker-compose.yml\n.env\n"
    ),
    fs.writeFile(PACKAGE_JSON_PATH, newPackageJson),
    fs.writeFile(README_PATH, readme.replaceAll("REMIXAPP", APP_NAME)),
    fs.writeFile(APPROOT_PATH, appRoot.replaceAll("REMIXAPP", APP_NAME)),
    fs.writeFile(APPINDEX_PATH, appIndex.replaceAll("REMIXAPP", APP_NAME)),
    fs.writeFile(
      DOCKERCOMPOSE_PATH,
      dockerCompose.replaceAll("REMIXAPP", APP_NAME)
    ),
  ]);
}

module.exports = main;

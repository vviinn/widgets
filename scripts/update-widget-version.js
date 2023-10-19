const fs = require("fs");
const path = require("path");

console.log("Current Working Directory:", process.cwd());
console.log("Resolved package.json Path:", path.resolve("./package.json"));

const packageJson = require("../package.json");
const storybookPackageJsonPath = "../storybook/package.json";
const packageJsonStorybook = require(storybookPackageJsonPath);

const packageName = "vviinn-widgets";

function updatePackageVersion() {
  const widgetVersion = packageJson.version;

  if (packageJsonStorybook?.dependencies?.[packageName]) {
    packageJsonStorybook.dependencies.packageName = widgetVersion;
  } else {
    console.error(`Package "${packageName}" not found in dependencies.`);
    return;
  }

  fs.writeFileSync(
    storybookPackageJsonPath,
    JSON.stringify(packageJsonStorybook, null, 2)
  );

  console.log(
    `Version of "${packageName}" updated to "${widgetVersion}" in Storybok's package.json.`
  );
}

updatePackageVersion();

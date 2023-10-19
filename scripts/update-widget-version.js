const fs = require("fs");
const path = require("path");

const packageJsonPath = path.resolve(__dirname, "../package.json");
const storybookPackageJsonPath = path.resolve(
  __dirname,
  "../storybook/package.json"
);

const packageJson = require(packageJsonPath);
const packageJsonStorybook = require(storybookPackageJsonPath);
const packageName = "vviinn-widgets";

function updatePackageVersion() {
  const widgetVersion = packageJson.version;

  if (packageJsonStorybook?.dependencies?.[packageName]) {
    packageJsonStorybook.dependencies[packageName] = widgetVersion;
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

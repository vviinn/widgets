const fs = require("fs");
const packageJson = require("./package.json");
const packageJsonStorybook = require("./storybook/package.json");

const packageName = "vviinn-widgets";
const storybookPackageJsonPath = "./storybook/package.json";

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

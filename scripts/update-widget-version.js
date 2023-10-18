const fs = require("fs");

const packageName = "vviinn-widgets";
const storybookPackageJsonPath = "./storybook/package.json";

function updatePackageVersion() {
  const widgetVersion = require("./package.json").version;
  const packageJsonStorybook = require(storybookPackageJsonPath);

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

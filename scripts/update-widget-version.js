const fs = require("fs");
const path = require("path");

console.log("Current Files in Directory:", fs.readdirSync("."));

const packageJson = require("package.json");
const packageJsonStorybook = require("storybook/package.json");
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
    "storybook/package.json",
    JSON.stringify(packageJsonStorybook, null, 2)
  );

  console.log(
    `Version of "${packageName}" updated to "${widgetVersion}" in Storybok's package.json.`
  );
}

updatePackageVersion();

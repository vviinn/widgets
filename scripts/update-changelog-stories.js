const fs = require("fs");

fs.readFile("./CHANGELOG.md", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const releases = data.split("\n").filter((result) => result !== "");

  let releasesFilter = releases.map((releae, index) => {
    const titleSplit = releae.split(" ");

    if (index === 1) {
      releae = releae.replace(". See [standard-version]", "");
    }

    if (
      titleSplit.length === 3 &&
      (titleSplit[0] === "##" || titleSplit[0] === "###") &&
      titleSplit[1] !== "Bug"
    ) {
      const date = titleSplit[2].replace("(", "").replace(")", "");
      const version = titleSplit[1].split("]")[0].replace("[", "");
      return `## v. ${version} - ${date}${
        releases[index + 1] === "### Bug Fixes" ||
        releases[index + 1] === "### Features" ||
        releases[index + 1] === "### ⚠ BREAKING CHANGES"
          ? ""
          : "\nInternal release"
      }`;
    } else {
      return `${releae.replace("*", "-").split("(")[0].trimEnd()}`;
    }
  });

  releasesFilter.unshift('<Meta title="Changelog/Changelog"></Meta>');
  releasesFilter.unshift(
    'import { Meta, Story, Canvas } from "@storybook/addon-docs";'
  );

  console.log();

  fs.writeFile(
    "./storybook/documentation/changelog.stories.mdx",
    releasesFilter.join("\n\r"),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
});

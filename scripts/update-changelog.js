const fs = require("fs");

fs.readFile("./CHANGELOG.md", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const releases = data.split("\n").filter((result) => result !== "");

  let releasesFilter = releases.map((release, index) => {
    const titleSplit = release.split(" ");

    if (index === 1) {
      release = release.replace(". See [commit-and-tag-version]", "");
    }

    if (
      titleSplit.length === 3 &&
      (titleSplit[0] === "##" || titleSplit[0] === "###") &&
      titleSplit[1] !== "Bug"
    ) {
      const date = titleSplit[2].replace("(", "").replace(")", "");
      const version = titleSplit[1].split("]")[0].replace("[", "");
      if (
        releases[index + 1] === "### Bug Fixes" ||
        releases[index + 1] === "### Features" ||
        releases[index + 1] === "### ⚠ BREAKING CHANGES"
      ) {
        return `## v. ${version} - ${date}`;
      } else {
        return;
      }
    } else {
      return `${release.replace("*", "-").split("(")[0].trimEnd()}`;
    }
  });

  releasesFilter.unshift('<Meta title="Changelog/Changelog"></Meta>');
  releasesFilter.unshift(
    'import { Meta, Story, Canvas } from "@storybook/addon-docs/blocks";',
  );

  fs.writeFile(
    "./storybook/documentation/change-log/1_changelog.mdx",
    releasesFilter.filter((release) => release).join("\n\r"),
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
});

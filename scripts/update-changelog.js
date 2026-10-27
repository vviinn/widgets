const fs = require("fs");
const path = require("path");

const changelogPath = path.resolve(__dirname, "../CHANGELOG.md");
const storybookChangelogPath = path.resolve(
  __dirname,
  "../storybook/documentation/change-log/1_changelog.mdx",
);
// "## [2.227.0](https://…) (2026-10-12)"; patch releases use "###", early ones have no link.
const versionHeading = /^#{2,3} \[?([\d.]+)\]?(?:\([^)]*\))? \(([\d-]+)\)$/;

const isSectionHeading = (line) =>
  line?.startsWith("### ") && !versionHeading.test(line);

const releases = fs
  .readFileSync(changelogPath, "utf8")
  .split("\n")
  .filter((result) => result !== "");

const releasesFilter = releases.map((release, index) => {
  const heading = release.match(versionHeading);

  if (heading) {
    const [, version, date] = heading;
    // A release with no user-facing sections is left out.
    if (isSectionHeading(releases[index + 1])) {
      return `## v. ${version} - ${date}`;
    }
    return;
  }
  return `${release.replace("*", "-").split("([")[0].trimEnd()}`;
});

releasesFilter.unshift('<Meta title="Changelog/Changelog"></Meta>');
releasesFilter.unshift(
  'import { Meta, Story, Canvas } from "@storybook/addon-docs/blocks";',
);

// The directory holds only this generated file, so a fresh checkout lacks it.
fs.mkdirSync(path.dirname(storybookChangelogPath), { recursive: true });
fs.writeFileSync(
  storybookChangelogPath,
  releasesFilter.filter((release) => release).join("\n\r"),
);

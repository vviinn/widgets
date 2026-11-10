const fs = require("fs");
const path = require("path");

// rollup-plugin-sbom writes the same cyclonedx/bom.json into every output target. The
// package carries one copy at a stable path, which a pinned CDN URL finds for each version.
const root = path.resolve(__dirname, "..");
const sbomDirs = fs
  .globSync("{dist,www}/**/cyclonedx", { cwd: root })
  .map((dir) => path.join(root, dir));

if (!sbomDirs.length) {
  console.error(
    "No SBOM in the build output: rollup-plugin-sbom runs only when ENV=production.",
  );
  process.exit(1);
}

fs.copyFileSync(
  path.join(sbomDirs[0], "bom.json"),
  path.join(root, "dist/sbom.cdx.json"),
);
sbomDirs.forEach((dir) => fs.rmSync(dir, { recursive: true }));

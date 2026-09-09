const fs = require("fs");
const path = require("path");

// Stencil's dist target copies every .js under srcDir into dist/collection, so a
// dev harness file moved back into src/ would carry a developer's token into the
// published package — see dev/dev-harness.js.
const collectionPath = path.resolve(__dirname, "../dist/collection");

function verifyNoDevLeak() {
  if (!fs.existsSync(collectionPath)) return;

  const leaked = fs
    .readdirSync(collectionPath)
    .filter((entry) => entry.startsWith("dev-"));

  if (leaked.length) {
    console.error(
      `Dev harness files leaked into dist/collection: ${leaked.join(", ")}.\n` +
        "They must live in dev/, outside srcDir, so the build never copies them.",
    );
    process.exit(1);
  }
}

verifyNoDevLeak();

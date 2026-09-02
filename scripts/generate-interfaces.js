delete process.env.OPENAPI_URL;
require("dotenv").config();
const swaggerToTS = require("openapi-typescript").default;
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const main = async () => {
  const outPath = process.argv[2];
  if (!outPath) {
    console.error("Usage: node generate-interfaces.js <output-path>");
    process.exit(1);
  }

  let result;

  try {
    const openApiUrl = process.env.OPENAPI_URL?.trim();

    if (!openApiUrl) {
      throw new Error("OPENAPI_URL is not defined in .env");
    }

    let spec;

    // Local file
    if (
      openApiUrl.startsWith("./") ||
      openApiUrl.startsWith("/") ||
      openApiUrl.startsWith("file://")
    ) {
      const filePath = path.resolve(
        process.cwd(),
        openApiUrl.replace(/^file:\/\//, ""),
      );
      console.log(`Loading local OpenAPI spec: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        throw new Error(
          `File not found: ${filePath}\nRun: npm run update.openapi`,
        );
      }

      const fileContent = fs.readFileSync(filePath, "utf8");
      spec = yaml.load(fileContent); // Parse YAML to object
    } else {
      // Remote URL (fallback)
      console.log(`Fetching OpenAPI spec from: ${openApiUrl}`);
      const res = await fetch(openApiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      spec = text.trim().startsWith("{") ? JSON.parse(text) : yaml.load(text);
    }

    // Generate TypeScript interfaces
    let text = await swaggerToTS(spec);

    // Remove legacy bug with examples
    text = text.replace(
      ` &
          components["examples"]["rectangle"]`,
      "",
    );

    // Write to file
    result = fs.createWriteStream(outPath);
    await new Promise((resolve, reject) => {
      result.on("error", reject);
      result.on("finish", resolve);
      result.write(text);
      result.end();
    });

    console.info("Interfaces created:", outPath);
    process.exit(0);
  } catch (err) {
    console.error("Can not load Swagger schema:", err.message);
    if (result) {
      result.destroy();
    }
    process.exit(1);
  }
};

main();

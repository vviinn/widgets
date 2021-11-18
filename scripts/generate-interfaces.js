const dotenv = require("dotenv").config();
const swaggerToTS = require("openapi-typescript").default;
const fs = require("fs");

const main = async () => {
  const outPath = process.argv[2];
  const result = fs.createWriteStream(outPath);

  try {
    let text = await swaggerToTS(process.env.OPENAPI_URL);

    text = text.replace(
      ` &
          components["examples"]["rectangle"]`,
      ""
    );

    result.write(text);
    result.close();
    console.info("Interfaces created!");
    process.exit(0);
  } catch (err) {
    console.error("Can not load Swagger schema:", err.message);
    process.exit(1);
  }
};

main();

const dotenv = require('dotenv').config();
const swaggerToTS = require('@manifoldco/swagger-to-ts');
const http = require('https');
const fs = require('fs');
const path = __dirname + '/schema.yaml';
const outPath = process.argv[2];
const file = fs.createWriteStream(path);
const result = fs.createWriteStream(outPath);
const yaml = require('js-yaml');

http
  .get(process.env.OPENAPI_URL, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      const yamlToJs = yaml.load(fs.readFileSync(path));

      let text = swaggerToTS.default(yamlToJs);
      text = text.replaceAll(` &
          components["examples"]["rectangle"]`, '');

      result.write(text);
      result.close();
      file.close();
      fs.unlinkSync(path);
      console.info('Interfaces created!');
      process.exit(0);
    });

    file.on('error', (err) => {
      fs.unlinkSync(path);
      console.error('Can not read schema:', err.message);
      process.exit(1);
    });
  })
  .on('error', (err) => {
    console.error('Can not load Swagger schema:', err.message);
    process.exit(1);
  });

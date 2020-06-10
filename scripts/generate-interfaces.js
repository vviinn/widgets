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
    file.on('finish', (x) => {
      const yamlToJs = yaml.load(fs.readFileSync(path));
      result.write(swaggerToTS.default(yamlToJs));
      result.close();
      file.close();
      fs.unlinkSync(path);
    });
  })
  .on('error', (err) => {
    console.log('Can not load Swagger schema:', err.message);
  });

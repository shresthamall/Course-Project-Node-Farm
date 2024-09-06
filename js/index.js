// import fs from 'fs';
import { ENCODING } from './config.js';
import { CONTENT_HTML } from './config.js';
import { CONTENT_JSON } from './config.js';
import { STATUS_NOT_FOUND } from './config.js';
import { STATUS_OK } from './config.js';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as _url from 'url';

const __dirname = path.dirname(
  _url.fileURLToPath(new URL('../node_farm', import.meta.url))
);

//////////////////////////
// HTML templates
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  ENCODING
);

const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  ENCODING
);

const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  ENCODING
);

// Helper functions

// Server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  // Overview page
  if (pathName === '/' || pathName === 'overview') {
    res.writeHead(STATUS_OK, CONTENT_HTML);
    res.end(templateOverview);
    // Product page
  } else if (pathName === 'product') {
    res.end('This is the product');
  } else if (pathName === '/api') {
    fs.readFile(`${__dirname}/../dev-data/data.json`, ENCODING, (err, data) => {
      if (err) return alert('Could not read file');
      const productData = JSON.parse(data);
      //   console.log(productData);
      res.writeHead(STATUS_OK, { 'Content-type': 'application/json' });
      res.end(data);
    });
  }
  // Page not found
  else {
    res.writeHead(STATUS_NOT_FOUND, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
  }
});

server.listen(8000, () => {
  console.log('Listening on port 8000');
});

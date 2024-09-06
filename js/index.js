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

//////////////////////////
// Initialize __dirname for ES Module
const __dirname = path.dirname(
  _url.fileURLToPath(new URL('../node_farm', import.meta.url))
);
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
console.log(templateCard);

// Data
// [dataObjects]
const dataObj = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data.json`, ENCODING)
);
console.log(typeof dataObj);

/* 
{%PRODUCT%}
{%IMAGE%}
{%NOT_ORGANIC%}
{%QUANTITY%}
{%PRICE%}
{%ID%}
*/

// Helper functions
const replaceTemplate = function (template, product) {
  const markup = template
    .replace(/{%PRODUCT%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%NOT_ORGANIC%}/g, `${product.organic ? '' : 'not-organic'}`)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%ID%}/g, product.id);
  console.log(product.id, product.image, markup);
  return markup;
};

// Server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  // Overview page
  if (pathName === '/' || pathName === 'overview') {
    // HTML markup for product cards
    const cardsHTML = dataObj
      .map(product => replaceTemplate(templateCard, product))
      .join('');
    const markupCards = templateOverview.replace(
      /{%PRODUCT_CARDS%}/,
      cardsHTML
    );
    res.writeHead(STATUS_OK, CONTENT_HTML);
    res.end(markupCards);
    // Product page
  } else if (pathName === 'product') {
    res.end('This is the product');
  } else if (pathName === '/api') {
    fs.readFile(`${__dirname}/../dev-data/data.json`, ENCODING, (err, data) => {
      if (err) return;
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

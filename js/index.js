// import fs from 'fs';
import { ENCODING } from './config.js';
import { CONTENT_HTML } from './config.js';
import { CONTENT_JSON } from './config.js';
import { STATUS_NOT_FOUND } from './config.js';
import { STATUS_OK } from './config.js';
import * as fs from 'fs';
import * as http from 'http';
import * as _url from 'url';
import { __dirname } from './config.js';

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

// Data
// [dataObjects]
const dataObj = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data.json`, ENCODING)
);

/* 
following ++ in template-card
{%PRODUCT%}
{%IMAGE%}
{%NOT_ORGANIC%}
{%QUANTITY%}
{%PRICE%}
{%ID%}
following ++ in template-product
{%NUTRIENTS%}
{%FROM%}
{%DESCRIPTION%}
*/

// Helper functions
const replaceTemplate = function (template, product) {
  const markup = template
    .replace(/{%PRODUCT%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%NOT_ORGANIC%}/g, `${product.organic ? '' : 'not-organic'}`)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%ID%}/g, product.id)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%DESCRIPTION%}/g, product.description);
  // console.log(product.id, product.image, markup);
  return markup;
};

// Router

// Returns markup for Overview
const routeOverviewMarkup = function () {
  const cardsHTML = dataObj
    .map(product => replaceTemplate(templateCard, product))
    .join('');

  return templateOverview.replace(/{%PRODUCT_CARDS%}/, cardsHTML);
};

// Returns markup for Product with id specified as argument
const routeProductMarkup = function (productId) {
  const productObject = dataObj.find(product => product.id === +productId);
  return replaceTemplate(templateProduct, productObject);
};

// Route according to requestUrl
const route = function (requestUrl, res) {
  const { query, pathname: pathName } = requestUrl;
  console.log(dataObj.some(product => product.id === +requestUrl.query.id));

  // Overview page
  if (pathName === '/' || pathName === '/overview') {
    // HTML markup for product cards
    const markupCards = routeOverviewMarkup();
    res.writeHead(STATUS_OK, CONTENT_HTML);
    res.end(markupCards);
    return;
  }
  // Product page
  if (
    pathName === '/product' &&
    dataObj.some(product => product.id === +query.id)
  ) {
    const markupProduct = routeProductMarkup(query.id);
    res.writeHead(STATUS_OK, CONTENT_HTML);
    res.end(markupProduct);
    return;
  }
  // if (pathName === '/api') {
  //   fs.readFile(`${__dirname}/../dev-data/data.json`, ENCODING, (err, data) => {
  //     if (err) return;
  //     const productData = JSON.parse(data);
  //     res.writeHead(STATUS_OK, { 'Content-type': 'application/json' });
  //     res.end(data);
  //   });
  // }
  // Page not found
  else {
    console.log('else statement executed');
    res.writeHead(STATUS_NOT_FOUND, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end();
  }
};

// Server
const server = http.createServer((req, res) => {
  // Request url
  const requestUrl = _url.parse(req.url, true);
  // console.log(requestUrl);
  route(requestUrl, res);
});

server.listen(8000, () => {
  console.log('Listening on port 8000');
});

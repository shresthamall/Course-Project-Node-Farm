// import fs from 'fs';
import { ENCODING } from './js/config';
import { CONTENT_HTML } from './js/config';
import { CONTENT_JSON } from './js/config';
import { STATUS_NOT_FOUND } from './js/config';
import { STATUS_OK } from './js/config';

const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

//////////////////////////
// HTML templates
const templateOverview = fs.readFileSync(
  `${__dirname}/template/template-overview.html`,
  ENCODING
);

const templateProduct = fs.readFileSync(
  `${__dirname}/template/template-product.html`,
  ENCODING
);

const templateCard = fs.readFileSync(
  `${__dirname}/template/template-card.html`,
  ENCODING
);

// Helper functions

// Server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  // Overview page
  if (pathName === '/' || pathName === 'overview') {
    res.end('This is the Overview');
    // Product page
  } else if (pathName === 'product') {
    res.end('This is the product');
  } else if (pathName === '/api') {
    fs.readFile(`${__dirname}/dev-data/data.json`, ENCODING, (err, data) => {
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

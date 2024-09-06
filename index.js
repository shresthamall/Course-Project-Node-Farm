// import fs from 'fs';
const ENCODING = 'utf-8';
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const hello = 'Hello World';
console.log(hello);

const textIn = fs.readFileSync('./txt/input.txt', ENCODING);
console.log(textIn);

//////////////////////////
const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === '/' || pathName === 'overview') {
    res.end('This is the Overview');
  } else if (pathName === 'product') {
    res.end('This is the product');
  } else if (pathName === '/api') {
    fs.readFile(`${__dirname}/dev-data/data.json`, ENCODING, (err, data) => {
      if (err) return alert('Could not read file');
      const productData = JSON.parse(data);
      //   console.log(productData);
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(data);
    });
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
  }
});

server.listen(8000, () => {
  console.log('Listening on port 8000');
});

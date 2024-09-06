import * as path from 'path';
import * as _url from 'url';
export const ENCODING = 'utf-8';
export const CONTENT_HTML = {
  'Content-type': 'text/html',
};
export const CONTENT_JSON = {
  'Content-type': 'application/json',
};
export const STATUS_OK = 200;
export const STATUS_NOT_FOUND = 404;

//////////////////////////
// Initialize __dirname for ES Module
export const __dirname = path.dirname(
  _url.fileURLToPath(new URL('../node_farm', import.meta.url))
);

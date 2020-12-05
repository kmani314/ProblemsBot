const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./configBase.json'));
data.BOT_TOKEN = process.argv[2];
data.db_string = process.argv[3];
fs.writeFileSync('./config.json', JSON.stringify(data));

import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./configBase.json'));
[, , data.BOT_TOKEN, data.dbString] = [process.env.bot_key, process.env.db_string];
fs.writeFileSync('./config.json', JSON.stringify(data));

const Discord = require('discord.js');
const { BOT_TOKEN, prefix, db_string } = require('../config.json');
const fs = require('fs');
const db = require('./db');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (err) {
    console.log(err);
    message.reply('Internal Error!');
  }
});

client.on('guildCreate', guild => {
  db.onGuildJoin(guild);
  console.log(guild);
});


db.connection.once('open', () => {
  client.login(BOT_TOKEN);
  console.log("ProblemsBot online.");
});

import Discord from 'discord.js';
import db from './db.js';
import config from '../config.json';

import about from './commands/about.js';
import answer from './commands/answer.js';
import help from './commands/help.js';
import leaderboard from './commands/leaderboard.js';
import problem from './commands/problem.js';
import resetAll from './commands/reset-all.js';
import reset from './commands/reset.js';
import right from './commands/right.js';
import wrong from './commands/wrong.js';
import stats from './commands/stats.js';

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commands = [about, answer, help, leaderboard, problem, resetAll, reset, right, wrong, stats];

commands.forEach((c) => {
  client.commands.set(c.name, c);
});

client.on('message', (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (err) {
    console.log(err);
    message.reply('Internal Error!');
  }
});

client.on('guildCreate', (guild) => {
  db.onGuildJoin(guild);
  console.log(`Joined new: ${guild.name}`);
});

client.on('guildLeave', (guild) => {
  db.onGuildLeave(guild);
  console.log(`Left: ${guild.name}`);
});

db.connection.once('open', () => {
  client.login(config.BOT_TOKEN);
  console.log('ProblemsBot online.');
});

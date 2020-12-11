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

db.init();

commands.forEach((c) => {
  client.commands.set(c.name, c);
});

client.on('guildCreate', async (guild) => {
  await db.onGuildJoin(guild);

  console.log(`Joined new: ${guild.name}`);

  // const channel = guild.channels.cache.reduce((c) => c.type === 'text').get(0);

  const channels = guild.channels.cache.filter((c) => c.type === 'text');
  /* eslint-disable */
  for (let i of channels) {
    i[1].send(`Thanks for adding ProblemsBot! For help, run \`${config.prefix}help\``);
    break;
  }
  /* eslint-enable */
});

client.on('guildDelete', async (guild) => {
  await db.onGuildLeave(guild.id);
  console.log(`Left: ${guild.name}`);
});

db.connection.once('open', () => {
  client.login(config.BOT_TOKEN);
});

client.on('ready', () => {
  console.log('ProblemsBot online.');
  client.user.setActivity(config.status);
});

client.on('message', async (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  if (!message.guild) {
    // is a dm
    if (await db.onReceiveDM(message)) {
      message.author.send(`Thanks for messaging ProblemsBot. For help, run \`${config.prefix}help\``);
    }
  }

  try {
    await client.commands.get(command).execute(message, args);
  } catch (err) {
    console.log(err);
    message.reply(`${message.guild ? 's' : 'S'}omething went wrong.`);
  }
});

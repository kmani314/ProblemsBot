import { MessageEmbed } from 'discord.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'leaderboard',
  description: 'get server leaderboard',
  args: [],
  async execute(message) {
    if (!message.guild) {
      message.author.send('This command is not available in DMs.');
      return;
    }

    const members = await message.guild.members.fetch();
    let players = await db.getServerUsers(message.guild.id);

    players = players.sort((a, b) => (a.score > b.score ? -1 : 1));

    const fields = [];
    const medal = ['🥇', '🥈', '🥉'];

    players.forEach((p, i) => {
      const name = members.get(`${p.discord_id}`).displayName;
      const num = i < 3 ? medal[i] : `${i + 1}.`;
      if (name) {
        fields.push({ name: `${num} ${name}`, value: `${p.score} point${Math.abs(p.score) === 1 ? '' : 's'}` });
      }
    });

    const embed = new MessageEmbed()
      .setColor(config.color)
      .setTitle('Leaderboard')
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(`The leaderboard can be run by an administrator running \`${config.prefix}reset-all\`.`)
      .addFields(fields);

    message.channel.send(embed);
  },
};

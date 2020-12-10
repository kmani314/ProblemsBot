import { MessageEmbed } from 'discord.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'stats',
  description: 'get your stats',
  args: [],
  async execute(message) {
    const asker = await db.getUniqueServerUser(
      message.guild ? message.guild.id : message.author.id,
      message.author.id,
    );

    if (!asker) {
      message.reply(`${message.guild ? 'y' : 'Y'}ou haven't answered any problems.`);
      return;
    }

    const embed = new MessageEmbed()
      .setColor(config.color)
      .setAuthor(`${message.guild ? message.member.displayName : message.author.username}`, message.author.avatarURL())
      .setTitle('Statistics')
      .setDescription(`Statistics can be reset with \`${config.prefix}reset\`, or for the whole server by an administrator running \`${config.prefix}reset-all\`.`)
      .addFields(
        { name: '💯', value: asker.score, inline: true },
        { name: '✅', value: asker.right, inline: true },
        { name: '❌', value: asker.wrong, inline: true },
      );

    message.channel.send(embed);
  },
};

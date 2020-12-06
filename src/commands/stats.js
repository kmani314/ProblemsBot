import { MessageEmbed } from 'discord.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'stats',
  description: 'get your stats',
  args: [],
  async execute(message) {
    try {
      const asker = await db.getUniqueServerUser(message.guild.id, message.author.id);

      if (!asker) {
        message.reply("you haven't answered any problems.");
        return;
      }

      const embed = new MessageEmbed()
        .setColor(config.color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle('Statistics')
        .setDescription(`Statistics can be reset with \`${config.prefix}reset\`, or for the whole server by an administrator running \`${config.prefix}reset-all\`.`)
        .addFields(
          { name: '💯', value: asker.score, inline: true },
          { name: '✅', value: asker.right, inline: true },
          { name: '❌', value: asker.wrong, inline: true },
        );

      message.channel.send(embed);
    } catch (err) {
      message.reply('Something went wrong.');
      console.log(err);
    }
  },
};

import { MessageEmbed } from 'discord.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'reset-all',
  description: 'reset the whole server',
  args: [],
  async execute(message) {
    try {
      if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
        const embed = new MessageEmbed()
          .setColor(config.color)
          .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
          .setTitle('Insufficient permissions')
          .setDescription('You must be able to ban and kick to reset the server.');
        message.channel.send(embed);
        return;
      }

      const users = await db.getServerUsers(message.guild.id);

      /* eslint-disable */
      for (const i of users) {
        db.deleteUserAndReferences(message.guild.id, message.author.id);
      }
      /* eslint-enable */

      const embed = new MessageEmbed()
        .setColor(config.color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle('Server reset')
        .setDescription('Stats for the entire server have been reset.');

      message.channel.send(embed);
    } catch (err) {
      message.reply('Something went wrong.');
      console.log(err);
    }
  },
};

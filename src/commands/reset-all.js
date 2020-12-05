import { MessageEmbed } from 'discord.js';
import { user, guild } from '../schema.js';
import config from '../../config.json';

export default {
  name: 'reset-all',
  description: 'reset the whole server',
  args: [],
  async execute(message) {
    try {
      const server = await guild.findOne({ discord_id: message.guild.id }).exec();

      if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
        const embed = new MessageEmbed()
          .setColor(config.color)
          .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
          .setTitle('Insufficient permissions')
          .setDescription('You must be able to ban and kick to reset the server.');
        message.channel.send(embed);
        return;
      }

      /* eslint-disable */
      for (const i of server.users) {
        await user.findByIdAndDelete(i).exec();
      }
      /* eslint-enable */

      server.users = [];
      server.save();

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

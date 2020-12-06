import { MessageEmbed } from 'discord.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'reset',
  description: 'reset your stats',
  args: [],
  async execute(message) {
    try {
      await db.deleteUserAndReferences(message.guild.id, message.author.id);

      const embed = new MessageEmbed()
        .setColor(config.color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle('Score reset')
        .setDescription(`Your personal score has been reset. Run \`${config.prefix}reset-all\` to reset the whole server.`);

      message.channel.send(embed);
    } catch (err) {
      message.reply('Something went wrong.');
      console.log(err);
    }
  },
};

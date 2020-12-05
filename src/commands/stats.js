const db = require('../db');
const { problem, user, guild } = require('../schema');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

module.exports = {
  name: 'stats',
  description: 'get your stats',
  args: [],
  async execute(message, args) {
    try {
      const asker = await user.findOne({ discord_id: message.author.id }).exec();

      if(!asker) {
        message.reply("you haven't answered any problems.");
      }

      const embed = new MessageEmbed()
        .setColor(color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle(`Statistics`)
        .setDescription(`Statistics can be reset with \`!reset\`, or for the whole server by an administrator running \`!reset-all\`  .`)
        .addFields(
          { name: '💯', value: asker.score, inline: true },
          { name: '✅', value: asker.right, inline: true },
          { name: '❌', value: asker.wrong, inline: true },
        );

      message.channel.send(embed);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err);
    }
  }
}

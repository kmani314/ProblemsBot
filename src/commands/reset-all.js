const db = require('../db');
const { problem, user, guild } = require('../schema');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

module.exports = {
  name: 'reset-all',
  description: 'reset the whole server',
  args: [],
  async execute(message, args) {
    try {
      const server = await guild.findOne({ discord_id: message.guild.id }).exec();

      if (!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])) {
        const embed = new MessageEmbed()
          .setColor(color)
          .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
          .setTitle(`Insufficient permissions`)
          .setDescription(`You must be able to ban and kick to reset the server.`)
        message.channel.send(embed);
        return;
      }

      for (let i of server.users) {
        await user.findByIdAndDelete(i).exec()
      }

      server.users = [];
      server.save();

      const embed = new MessageEmbed()
        .setColor(color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle(`Server reset`)
        .setDescription(`Stats for the entire server have been reset.`)

      message.channel.send(embed);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err);
    }
  }
}

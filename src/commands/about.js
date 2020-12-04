const { MessageAttachment, MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

module.exports = {
  name: 'about',
  description: 'about the bot',
  args: [],
  async execute(message, args) {
    const info = message.author;

    try {
      const embed = new MessageEmbed()
        .setColor(color)
        .setTitle('About')
        .setDescription('Written by krishnmani#2671. No copyright infringment intended.');
      message.channel.send(embed);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err);
    }
  }
}

const db = require('../db');
const { problem, user } = require('../schema');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

module.exports = {
  name: 'answer',
  description: 'get the answer to a problem',
  args: [],
  async execute(message, args) {
    const info = message.author;

    try {
      const asker = await user.findOne({ discord_id: info.id }).exec();

      if(!asker) {
        message.reply("you aren't currently solving a problem");
        return;
      }

      const prob = await problem.findOne({ _id: asker.active });

      if (!prob) {
        message.reply("you aren't currently solving a problem.");
        return;
      }

      const figures = (await prob.execPopulate('answerFigures')).answerFigures;

      const embed = new MessageEmbed()
        .setColor(color)
        .setTitle('Answer')
        .setAuthor(prob.source)
        .setURL(prob.url)
        .setDescription(prob.answer);

      if(figures[0]) {
        embed.attachFiles(new MessageAttachment(figures[0].img, 'figure.png'))
          .setImage('attachment://figure.png');
      }

      message.channel.send(embed);
    } catch(err) {
      console.log(err);
      message.reply("something went wrong.");
      return;
    }
  }
}

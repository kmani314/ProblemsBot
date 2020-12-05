import { MessageAttachment, MessageEmbed } from 'discord.js';
import { problem, user } from '../schema.js';
import config from '../../config.json';

export default {
  name: 'answer',
  description: 'get the answer to a problem',
  args: [],
  async execute(message) {
    const info = message.author;

    try {
      const asker = await user.findOne({ discord_id: info.id }).exec();

      if (!asker) {
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
        .setColor(config.color)
        .setTitle('Answer')
        .setAuthor(prob.source)
        .setURL(prob.url)
        .setDescription(prob.answer);

      if (figures[0]) {
        embed.attachFiles(new MessageAttachment(figures[0].img, 'figure.png'))
          .setImage('attachment://figure.png');
      }

      message.channel.send(embed);
    } catch (err) {
      console.log(err);
      message.reply('something went wrong.');
    }
  },
};

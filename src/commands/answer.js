import { MessageAttachment, MessageEmbed } from 'discord.js';
import { problem } from '../schema.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'answer',
  description: 'get the answer to a problem',
  args: [],
  async execute(message) {
    try {
      const asker = await db.getUniqueServerUser(message.guild.id, message.author.id);

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

      // discord only allows one image per embed :(
      // figures.forEach((f, i) => {
      //   embed.attachFiles(new MessageAttachment(f.img, `figure${i}.png`))
      //     .setImage('attachment://figure%.png');
      // })

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

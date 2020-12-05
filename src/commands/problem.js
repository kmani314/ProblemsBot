import { MessageAttachment, MessageEmbed } from 'discord.js';
import { problem, user } from '../schema.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'problem',
  description: 'get a random problem',
  args: ['search terms'],
  async execute(message) {
    const info = message.author;

    try {
      let match = await user.findOne({ discord_id: info.id }).exec();

      match = await db.tryAddUser(message);

      const count = await problem.countDocuments().exec();
      const fact = Math.floor(Math.random() * count);
      const rand = await problem.findOne().skip(fact);

      if (!rand) {
        message.reply("I don't have any problems right now. Please try later.");
        return;
      }

      const { figures } = (await rand.execPopulate('figures'));

      const embed = new MessageEmbed()
        .setColor(config.color)
        .setTitle(rand.name || 'Problem statement')
        .setURL(rand.url)
        .setAuthor(rand.source)
        .setDescription(rand.text)
        .setFooter('Please run !answer when you are ready.');

      if (figures[0]) {
        embed.attachFiles(new MessageAttachment(figures[0].img, 'figure.png'))
          .setImage('attachment://figure.png');
      }

      message.channel.send(embed);
      match.start = Date.now();

      /* eslint-disable */
      match.active = rand._id;
      match.given_problems.push(rand._id);
      /* eslint-enable */

      match.save();
    } catch (err) {
      message.reply('something went wrong.');
      console.log(err);
    }
  },
};

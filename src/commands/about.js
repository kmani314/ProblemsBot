import { MessageEmbed } from 'discord.js';
import config from '../../config.json';

export default {
  name: 'about',
  description: 'about the bot',
  args: [],
  async execute(message) {
    try {
      const embed = new MessageEmbed()
        .setColor(config.color)
        .setTitle('About')
        .setDescription('Written by krishnmani#2671. No copyright infringment intended.');
      message.channel.send(embed);
    } catch (err) {
      message.reply('Something went wrong.');
      console.log(err);
    }
  },
};

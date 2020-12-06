import { MessageEmbed } from 'discord.js';
import { problem } from '../schema.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'right',
  description: 'mark the problem right',
  args: [],
  async execute(message) {
    try {
      const asker = await db.getUniqueServerUser(message.guild.id, message.author.id);

      if (!asker) {
        message.reply("you've never solved a problem on this server.");
        return;
      }

      const prob = await problem.findOne({ _id: asker.active });

      if (!prob) {
        message.reply("you aren't currently solving a problem.");
        return;
      }

      asker.score += prob.difficulty;
      const embed = new MessageEmbed()
        .setColor(config.color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle('Correct answer!')
        .setDescription(`You've earned **${prob.difficulty}** points. ✅\n Your new score: **${asker.score}**`);

      asker.active = null;
      asker.start = null;
      asker.right += 1;
      asker.save();

      message.channel.send(embed);
    } catch (err) {
      message.reply('something went wrong.');
      console.log(err);
    }
  },
};

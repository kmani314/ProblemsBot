import { MessageEmbed } from 'discord.js';
import { problem, user } from '../schema.js';
import config from '../../config.json';

export default {
  name: 'wrong',
  description: 'mark the problem wrong',
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

      const penalty = (11 - prob.difficulty);
      asker.score -= penalty;
      const embed = new MessageEmbed()
        .setColor(config.color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle('Incorrect answer')
        .setDescription(`You've lost **${penalty}** points. ❌\n Your new score: **${asker.score}**`);

      // you're penalized less for giving up on hard problems
      asker.active = null;
      asker.start = null;
      asker.wrong += 1;
      asker.save();

      message.channel.send(embed);
    } catch (err) {
      message.reply('something went wrong.');
    }
  },
};

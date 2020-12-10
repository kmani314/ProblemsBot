import { MessageEmbed } from 'discord.js';
import { problem } from '../schema.js';
import db from '../db.js';
import config from '../../config.json';

export default {
  name: 'wrong',
  description: 'mark the problem wrong',
  args: [],
  async execute(message) {
    const asker = await db.getUniqueServerUser(
      message.guild ? message.guild.id : message.author.id,
      message.author.id,
    );

    if (!asker) {
      message.reply(`${message.guild ? 'y' : 'Y'}'ve never solved a problem on this server.`);
      return;
    }

    const prob = await problem.findOne({ _id: asker.active });

    if (!prob) {
      message.reply(`${message.guild ? 'y' : 'Y'}ou aren't currently solving a problem.`);
      return;
    }

    const penalty = (11 - prob.difficulty);
    asker.score -= penalty;
    const embed = new MessageEmbed()
      .setColor(config.color)
      .setAuthor(`${message.guild ? message.member.displayName : message.author.username}`, message.author.avatarURL())
      .setTitle('Incorrect answer')
      .setDescription(`You've lost **${penalty}** points. ❌\n Your new score: **${asker.score}**`);

    asker.active = null;
    asker.start = null;
    asker.wrong += 1;
    asker.save();

    message.channel.send(embed);
  },
};

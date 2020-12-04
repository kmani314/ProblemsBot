const db = require('../db');
const { problem, user, guild } = require('../schema');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

module.exports = {
  name: 'right',
  description: 'mark the problem right',
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

      asker.score += prob.difficulty;
      const embed = new MessageEmbed()
        .setColor(color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle(`Correct answer!`)
        .setDescription(`You've earned **${prob.difficulty}** points. ✅\n Your new score: **${asker.score}**`)

      asker.active = null;
      asker.start = null;
      asker.right++;
      asker.save();

      message.channel.send(embed);
    } catch(err) {
      message.reply("something went wrong.");
      console.log(err);
      return;
    }
  }
}

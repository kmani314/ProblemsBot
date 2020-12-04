const db = require('../db');
const { problem, user, guild } = require('../schema');

module.exports = {
  name: 'right',
  description: 'mark the problem right',
  args: [],
  async execute(message, args) {
    const info = message.author;

    try {
      const asker = await user.findOne({ discord_id: info.id }).exec();
      const prob = await problem.findOne({ _id: asker.active });

      if (!prob) {
        message.reply("you aren't currently solving a problem.");
        return;
      }

      asker.score += prob.difficulty;
      message.reply(`nice! You've earned **${prob.difficulty}** points. ✅\n Your new score: **${asker.score}**`)  
      asker.active = null;
      asker.start = null;
      asker.right++;
      asker.save();
      return;
    } catch(err) {
      message.reply("something went wrong.");
      return;
    }
  }
}

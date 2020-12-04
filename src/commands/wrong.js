const db = require('../db');
const { problem, user, guild } = require('../schema');

module.exports = {
  name: 'wrong',
  description: 'mark the problem wrong',
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

      // you're penalized less for giving up on hard problems
      const penalty = (11 - prob.difficulty);
      asker.score -= penalty;
      message.reply(`you've lost **${penalty}** points for getting it wrong. ❌\n Your new score: **${asker.score}**`);
      asker.active = null;
      asker.start = null;
      asker.wrong++;
      asker.save();
      return;

    } catch(err) {
      message.reply("something went wrong.");
      return;
    }
  }
}

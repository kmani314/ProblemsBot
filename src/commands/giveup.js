const db = require('../db');
const { problem, user, guild } = require('../schema');

module.exports = {
  name: 'giveup',
  description: 'give up on solving a problem',
  args: [],
  async execute(message, args) {
    const info = message.author;

    try {
      const asker = await user.findOne({ discord_id: info.id }).exec();
      console.log(asker.active);
      const prob = await problem.findOne({ _id: asker.active });

      if (!prob) {
        message.reply("you aren't currently solving a problem.");
        return;
      }

      // you're penalized less for giving up on hard problems
      const penalty = (11 - prob.difficulty);
      asker.score -= penalty;
      message.reply(`the answer is: ||${prob.answer}||. You've lost **${penalty}** points for giving up.\n Your new score: **${asker.score}**`);
      asker.active = null;
      asker.start = null;
      asker.given_up++;
      asker.save();
      return;

    } catch(err) {
      message.reply("something went wrong.");
      return;
    }
  }
}


const db = require('../db');
const { problem, user} = require('../schema');

module.exports = {
  name: 'answer',
  description: 'answer a question',
  args: ['answer'],
  async execute(message, args) {
    const info = message.author;

    try {
      const asker = await user.findOne({ discord_id: info.id }).exec();
      const prob = await problem.findOne({ _id: asker.active });

      if (!prob) {
        message.reply("you aren't currently solving a problem.");
        return;
      }

      if (args.length == 0) {
        message.reply("this command requires an argument.");
        return;
      }

      // need to make this more complex
      if (args[0] == prob.answer) {
        asker.score += prob.difficulty;
        message.reply(`nice! That is correct. You've earned **${prob.difficulty}** points.\n Your new score: **${asker.score}**`)  
        asker.active = null;
        asker.start = null;
        asker.solved++;
        asker.save();
        return;
      } else {
        message.reply("you're trash. Try again, or do `!giveup` for the answer.")
        return;
      }

    } catch(err) {
      message.reply("Something went wrong.");
      return;
    }
  }
}


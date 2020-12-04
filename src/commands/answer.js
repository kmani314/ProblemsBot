const db = require('../db');
const { problem, user} = require('../schema');

module.exports = {
  name: 'answer',
  description: 'get the answer to a problem',
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

      message.reply(`the answer is: ||${prob.answer}||.`);
    } catch(err) {
      message.reply("Something went wrong.");
      return;
    }
  }
}


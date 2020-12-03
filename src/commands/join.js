const db = require('../db');
const { problem, user, guild } = require('../schema');

module.exports = {
  name: 'join',
  description: 'join to track your score, solved problems, set time limits, etc.',
  async execute(message) {
    const info = message.author;

    try {
      const dup = await user.findOne({ discord_id: info.id }).exec();

      if (dup) {
        message.reply("You're already a member. Use `!stats` to check your stats.");
        return;
      }

      const id = await db.addUser(info);

      console.log(id);
      const server = await guild.findOne({ discord_id: message.guild.id });
      server.users.push(id);

      await server.save();

      message.reply("Welcome to the club! Now that you've joined, I'll keep track of your score, start a timer when you request a problem, and never recommended you the same problem twice.");
    } catch(err) {
      console.log(err);
      message.reply("Uh oh! I wasn't able to register you. Please try again later.");
      return;
    }
  }
}

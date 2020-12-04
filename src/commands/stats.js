const db = require('../db');
const { problem, user, guild } = require('../schema');

module.exports = {
  name: 'stats',
  description: 'get your stats',
  args: [],
  async execute(message, args) {
    try {
      const asker = await user.findOne({ discord_id: message.author.id }).exec();
      let res = `Stats for **${message.member.displayName}**\n`;
      res += `\`\`\``
      res += `Score: ${asker.score}\n`;
      res += `Problems correct: ${asker.right}\n`;
      res += `Problems incorrect: ${asker.wrong}`;
      res += `\`\`\``
      message.channel.send(res);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err);
    }
  }
}

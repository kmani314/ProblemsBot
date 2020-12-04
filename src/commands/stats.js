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
      res += `Score: **${asker.score}**\n`;
      res += `Problems solved: **${asker.solved}**\n`;
      res += `Problems given up: **${asker.given_up}**`;
      message.channel.send(res);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err);
    }
  }
}

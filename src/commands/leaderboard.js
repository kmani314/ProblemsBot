const db = require('../db');
const { problem, user, guild } = require('../schema');

module.exports = {
  name: 'leaderboard',
  description: 'get server leaderboard',
  args: [],
  async execute(message, args) {
    try {
      const members = await message.guild.members.fetch();
      let players = (await guild.findOne({ discord_id: message.guild.id }).populate('users')).users;
      players = players.sort((a, b) => a.score > b.score ? -1 : 1);

      let res = `**Leaderboard for ${message.guild.name}**\n\`\`\``;
      let medal = ['🥇', '🥈', '🥉'];

      players.forEach((p, i) => {
        const name = members.get(`${p.discord_id}`).displayName;
        const num = i < 2 ? medal[i] : `${i + 1}.`;
        if (name) {
          res += `${num} ${name} [${p.score}]\n`;
        } else {
          i--;
        }
        res += `\`\`\``
        message.channel.send(res);
      });

    } catch(err) {
      message.reply("something went wrong.")
      console.log(err);
    }
  }
}

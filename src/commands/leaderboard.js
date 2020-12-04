const db = require('../db');
const { problem, user, guild } = require('../schema');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

module.exports = {
  name: 'leaderboard',
  description: 'get server leaderboard',
  args: [],
  async execute(message, args) {
    try {
      const members = await message.guild.members.fetch();
      let players = (await guild.findOne({ discord_id: message.guild.id }).populate('users')).users;
      players = players.sort((a, b) => a.score > b.score ? -1 : 1);

      console.log(players);
      let fields = [];
      const medal = ['🥇', '🥈', '🥉'];
      
      players.forEach((p, i) => {
        const name = members.get(`${p.discord_id}`).displayName;
        const num = i < 2 ? medal[i] : `${i + 1}.`;
        if (name) {
          fields.push({name: `${num} ${name}`, value: `${p.score} point${Math.abs(p.score) == 1 ? '' : 's'}`});
        } else {
          i--;
        }
      });

      const embed = new MessageEmbed()
        .setColor(color)
        .setTitle('Leaderboard')
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription('The leaderboard can be run by an administrator running \`!reset-all\`.')
        .addFields(fields);

      message.channel.send(embed);
    } catch(err) {
      message.reply("something went wrong.")
      console.log(err);
    }
  }
}

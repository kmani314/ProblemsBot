const db = require('../db');
const { problem, user, guild, image } = require('../schema');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { color } = require('../../config.json');

async function tryAddUser(message) {
  const info = message.author;
  try {
    const dup = await user.findOne({ discord_id: info.id }).exec();

    if (dup) {
      return;
    }

    const res = await db.addUser(info);

    const server = await guild.findOne({ discord_id: message.guild.id });
    server.users.push(res.id);

    await server.save();
    return res;
    console.log("new user: " + res.id);
  } catch(err) {
    throw err;
  }
}

module.exports = {
  name: 'problem',
  description: 'get a random problem',
  args: ['search terms'],
  async execute(message, args) {
    const info = message.author;
    const resp = "";

    try {
      let match = await user.findOne({ discord_id: info.id }).exec();
      let res = "";

      if (!match) {
        res += "This appears to be your first time!\n";
        match = await tryAddUser(message);
      }

      const count = await problem.countDocuments().exec();
      const fact = Math.floor(Math.random() * count);
      const rand = await problem.findOne().skip(fact);

      const figures = (await rand.execPopulate('figures')).figures;

      const embed = new MessageEmbed()
        .setColor(color)
        .setTitle(rand.name || 'Problem statement')
        .setURL(rand.url)
        .setAuthor(rand.source)
        .setDescription(rand.text)
        .setFooter('Please run !answer when you are ready.');

      if(figures[0]) {
        embed.attachFiles(new MessageAttachment(figures[0].img, 'figure.png'))
          .setImage('attachment://figure.png');
      }

      message.channel.send(embed);
      match.active = rand._id;
      match.given_problems.push(rand._id);
      match.start = Date.now();
      match.save();

    } catch(err) {
      message.reply("something went wrong.");
      console.log(err);
    }
  }
}

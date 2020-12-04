const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).filter(file => file != 'help.js');
const arr = [];
const { color, prefix } = require('../../config.json');
const { MessageAttachment, MessageEmbed } = require('discord.js');

arr.push({ name: 'help', args: [], description: 'get this menu'});

for (const file of commandFiles) {
	const command = require(`./${file}`);
  arr.push(command);
}

module.exports = {
  name: 'help',
  async execute(message) {
    try {
      let fields = [];
      arr.forEach((a) => {
        fields.push({name: `${prefix}${a.name} ${a.args.map(a => `${a} `)}`, value: a.description})
      });

      const embed = new MessageEmbed()
        .setColor(color)
        .setTitle('Help')
        .addFields(fields);

      message.channel.send(embed);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err)
    }
  }
}

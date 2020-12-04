const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).filter(file => file != 'help.js');
const arr = [];
const { prefix } = require('../../config.json');

arr.push({ name: 'help', args: [], description: 'get this menu'});

for (const file of commandFiles) {
	const command = require(`./${file}`);
  arr.push(command);
}

module.exports = {
  name: 'help',
  async execute(message) {
    try {
      let res = "**Commands:**\`\`\`\n";
      arr.forEach((a) => {
        res += `${prefix}${a.name} [${a.args.map(a => `${a}, `)}]: ${a.description}\n`;
      });
      res += "\`\`\`"
      message.channel.send(res);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err)
    }
  }
}

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).filter(file => file != 'help.js');
const arr = [];
const { prefix } = require('../../config.json');

for (const file of commandFiles) {
	const command = require(`./${file}`);
  arr.push(command);
}

module.exports = {
  name: 'help',
  description: 'get this menu',
  args: [],
  async execute(message) {
    arr.push({ name: this.name, args: this.args, description: this.description });
    let res = "\`\`\`ProblemsBot commands:\n";
    arr.forEach((a) => {
      res += `${prefix}${a.name} [${a.args.map(a => `${a}, `)}]: ${a.description}\n`;
    });
    res += "\`\`\`"
    message.channel.send(res);
    console.log(message.guild);
  }
}

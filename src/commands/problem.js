const db = require('../db');
const { problem, user, guild } = require('../schema');

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
    console.log("new user: " + res.id);
  } catch(err) {
    throw err;
  }
}

async function addProblem(info) {
  const prob = await problem.create(info);
  return prob;
}

const test = {
  difficulty: 10,
  text: "What is 1 + 1?",
  answer: "2",
  source: "Test",
  url: ""
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

      res += `Here is your problem:\n Difficulty: ${rand.difficulty}\n **${rand.text}**`;

      match.active = rand._id;
      match.given_problems.push(rand._id);
      match.start = Date.now();
      match.save();

      message.reply(res);
    } catch(err) {
      message.reply("Something went wrong.");
      console.log(err);
    }
  }
}

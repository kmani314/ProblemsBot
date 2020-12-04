module.exports = {
  name: 'about',
  description: 'about the bot',
  args: [],
  async execute(message, args) {
    const info = message.author;

    try {
      message.channel.send("**About ProblemsBot:**\n\`\`\`Written by krishnamani#2671, problems from various sources.\`\`\`");
    } catch(err) {
      kessage.reply("Something went wrong.");
      console.log(err);
    }
  }
}

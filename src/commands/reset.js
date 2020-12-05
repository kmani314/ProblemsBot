import { MessageEmbed } from 'discord.js';
import { user, guild } from '../schema.js';
import config from '../../config.json';

export default {
  name: 'reset',
  description: 'reset your stats',
  args: [],
  async execute(message) {
    try {
      const asker = await user.findOne({ discord_id: message.author.id }).exec();
      const server = await guild.findOne({ discord_id: message.guild.id }).exec();

      if (asker) {
        /* eslint-disable-next-line */
        server.users.remove(asker._id);
        server.save();
        asker.remove();
      }

      const embed = new MessageEmbed()
        .setColor(config.color)
        .setAuthor(`${message.member.displayName}`, message.author.avatarURL())
        .setTitle('Score reset')
        .setDescription('Your personal score has been reset. Run `!reset-all` to reset the whole server.');

      message.channel.send(embed);
    } catch (err) {
      message.reply('Something went wrong.');
      console.log(err);
    }
  },
};

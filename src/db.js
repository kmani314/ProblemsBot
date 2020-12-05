import mongoose from 'mongoose';
import { user, guild } from './schema.js';
import config from '../config.json';

mongoose.connect(config.dbString, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

export default {
  connection: mongoose.connection,
  async onGuildJoin(info) {
    guild.create({ discord_id: info.id, users: [] }, (err) => {
      if (err) {
        console.log(err);
        info.leave();
      }
    });
  },

  async onGuildLeave(info) {
    const server = await guild.findOne({ discord_id: info.id }).exec();

    /* eslint-disable */
    for (const i of server.users) {
      await user.findByIdAndDelete(i).exec();
    }
    /* eslint-enable */

    server.remove();
  },

  async addUser(info) {
    const dbUser = await user.create({
      discord_id: info.id,
    });
    return dbUser;
  },

  async tryAddUser(message) {
    try {
      const info = message.author;
      const dup = await user.findOne({ discord_id: info.id }).exec();

      if (dup) {
        return dup;
      }

      const res = await this.addUser(info);

      const server = await guild.findOne({ discord_id: message.guild.id });
      server.users.push(res.id);

      await server.save();
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};

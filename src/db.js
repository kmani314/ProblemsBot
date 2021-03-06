import mongoose from 'mongoose';
import { user, guild } from './schema.js';
import config from '../config.json';

export default {
  connection: mongoose.connection,
  async init() {
    mongoose.connect(config.dbString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.connection = mongoose.connection.on('error', console.error.bind(console, 'connection error: '));
  },
  async onGuildJoin(info) {
    guild.create({ discord_id: info.id, users: [] }, (err) => {
      if (err) {
        console.log(err);
        info.leave();
      }
    });
  },

  async onReceiveDM(message) {
    const server = await guild.findOne({ discord_id: message.author.id }).exec();
    if (server) return false;

    await guild.create({ discord_id: message.author.id, users: [] });
    return true;
  },

  async addUser(id) {
    const dbUser = await user.create({
      discord_id: id,
    });
    return dbUser;
  },

  // This is really inefficient, but it doesn't matter
  async deleteUserAndReferences(guildId, id) {
    const server = await guild.findOne({ discord_id: guildId }).exec();
    const asker = await this.getUniqueServerUser(guildId, id);

    if (asker) {
      server.users.remove(asker._id);
      server.save();
      asker.remove();
    }
  },

  async getServerUsers(id) {
    const server = await guild.findOne({ discord_id: id }).exec();
    if (!server) return null;
    const { users } = (await server.execPopulate('users'));
    return users;
  },

  async getUniqueServerUser(guildId, id) {
    const users = await this.getServerUsers(guildId);
    if (!users) return null;
    return users.filter((obj) => obj.discord_id === id)[0];
  },

  async onGuildLeave(guildId) {
    const users = await this.getServerUsers(guildId);
    const server = await guild.findOne({ discord_id: guildId }).exec();

    /* eslint-disable */
    for (const i of users) {
      await user.findByIdAndDelete(i).exec();
    }
    /* eslint-enable */

    server.remove();
  },

  async tryAddUser(guildId, id) {
    const server = await guild.findOne({ discord_id: guildId }).exec();
    if (!server) return null;

    const match = await this.getUniqueServerUser(guildId, id);

    // this user already has an entry in this server
    if (match) {
      return user.findById(match._id);
    }

    const res = await this.addUser(id);

    server.users.push(res.id);

    await server.save();
    return res;
  },
};

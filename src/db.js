const mongoose = require('mongoose');
const { problem, user, guild } = require('./schema');
const { db_string } = require('../config.json');

mongoose.connect(db_string, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

module.exports = {
  connection: mongoose.connection,
  onGuildJoin(info) {
    const dbGuild = guild.create({ discord_id: info.id, users: [] }, (err, res) => {
      if (err) return err;
    });
  },

  async addUser(info) {
    try {
      const dbUser = await user.create({
        discord_id: info.id,
      });
      return dbUser;
    } catch(err) {
      if (err) throw err;
    }
  }
};

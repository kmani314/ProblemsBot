const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const problemSchema = new Schema({
  difficulty: Number,
  text: String,
  answer: Number,
  source: String,
  url: String,
});

const userSchema = new Schema({
  discord_id: {type: String, unique: true, required: true, dropDups: true },
  score: Number,
  given_problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  active: problemSchema,
  start: Date,
});

const guildSchema = new Schema({
  discord_id: {type: String, unique: true, required: true, dropDups: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = {
  user: model('User', userSchema),
  guild: model('Guild', guildSchema),
  problem: model('Problem', problemSchema)
};

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const problemSchema = new Schema({
  difficulty: { type: Number, min: 1, max: 10, default: 1 },
  text: { type: String, default: "" },
  answer: { type: String, default: "" },
  source: { type: String, default: "" },
  url: { type: String, default: "" },
});

const userSchema = new Schema({
  discord_id: {type: String, unique: true, required: true, dropDups: true },
  score: { type: Number, default: 0 },
  solved: { type: Number, min: 0, default: 0 },
  given_up: { type: Number, min: 0, default: 0 },
  given_problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  active: { type: Schema.Types.ObjectId, ref: 'Problem' },
  start: { type: Date, default: null },
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

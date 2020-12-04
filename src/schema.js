const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const imageSchema = new Schema({
  img: { type: Buffer, contentType: 'image/png'},
});

const problemSchema = new Schema({
  difficulty: { type: Number, min: 1, max: 10, default: 1 },
  text: { type: String, default: "" },
  name: { type: String, default: "" },
  figures: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  answer: { type: String, default: "" },
  answerFigures: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  source: { type: String, default: "" },
  url: { type: String, default: "" },
});

const userSchema = new Schema({
  discord_id: {type: String, unique: true, required: true, dropDups: true },
  score: { type: Number, default: 0 },
  right: { type: Number, min: 0, default: 0 },
  wrong: { type: Number, min: 0, default: 0 },
  given_problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  active: { type: Schema.Types.ObjectId, ref: 'Problem' },
  start: { type: Date, default: null },
});

const guildSchema = new Schema({
  discord_id: {type: String, unique: true, required: true, dropDups: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = {
  image: model('Image', imageSchema),
  user: model('User', userSchema),
  guild: model('Guild', guildSchema),
  problem: model('Problem', problemSchema)
};

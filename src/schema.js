import pkg from 'mongoose';

const { Schema, model } = pkg;
const imageSchema = new Schema({
  img: { type: Buffer, contentType: 'image/png' },
});

const problemSchema = new Schema({
  difficulty: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },
  text: { type: String, default: '' },
  name: { type: String, default: '' },
  figures: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  answer: { type: String, default: '' },
  answerFigures: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  source: { type: String, default: '' },
  url: { type: String, default: '' },
});

const userSchema = new Schema({
  // users will have one row for each server they are in
  discord_id: {
    type: String,
    unique: false,
    required: true,
    dropDups: true,
  },
  score: { type: Number, default: 0 },
  right: { type: Number, min: 0, default: 0 },
  wrong: { type: Number, min: 0, default: 0 },
  given_problems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  active: { type: Schema.Types.ObjectId, ref: 'Problem' },
  start: { type: Date, default: null },
});

const guildSchema = new Schema({
  discord_id: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const image = model('Image', imageSchema);
const user = model('User', userSchema);
const guild = model('Guild', guildSchema);
const problem = model('Problem', problemSchema);

export {
  image,
  user,
  guild,
  problem,
};

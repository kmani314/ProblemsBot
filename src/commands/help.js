import { MessageEmbed } from 'discord.js';
import config from '../../config.json';

import about from './about.js';
import answer from './answer.js';
import leaderboard from './leaderboard.js';
import problem from './problem.js';
import resetAll from './reset-all.js';
import reset from './reset.js';
import right from './right.js';
import wrong from './wrong.js';
import stats from './stats.js';

const commands = [about, answer, leaderboard, problem, resetAll, reset, right, wrong, stats];
commands.push({ name: 'help', args: [], description: 'get this menu' });

export default {
  name: 'help',
  async execute(message) {
    const fields = [];
    commands.forEach((a) => {
      fields.push({ name: `${config.prefix}${a.name} ${a.args.map((b) => `${b} `)}`, value: a.description });
    });

    const embed = new MessageEmbed()
      .setColor(config.color)
      .setTitle('Help')
      .addFields(fields);

    message.channel.send(embed);
  },
};

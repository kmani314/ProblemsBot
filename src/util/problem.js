import fs from 'fs';
import { problem, image } from '../schema.js';

async function addImage(path) {
  const data = fs.readFileSync(path);
  const img = await image.create({ img: data });
  return img;
}

async function addProblem(info) {
  const prob = info;
  const ansimg = await addImage('./answer.png');
  prob.answerFigures = [ansimg];
  return problem.create(prob);
}

const test = {
  name: 'Projectile between planets',
  difficulty: 4,
  text: `Two planets of mass M and radius R are at rest (somehow) with respect
to each other, with their centers a distance 4R apart. You wish to fire
a projectile from the surface of one planet to the other. What is the
minimum firing speed for which this is possible?`,
  source: 'Morin 5.55',
  url: 'https://irp-cdn.multiscreensite.com/721e955d/files/uploaded/classicaltextbook.pdf',
};

addProblem(test);

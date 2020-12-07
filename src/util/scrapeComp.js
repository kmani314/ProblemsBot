import https from 'https';
import puppeteer from 'puppeteer';
import cliProgress from 'cli-progress';
import { problem, image } from '../schema.js';
import config from '../../config.json';
import db from '../db.js';

async function asyncHttps(href) {
  return new Promise((resolve, reject) => {
    https.get(href, (res) => {
      let string;
      if (res.statusCode !== 200) reject();

      res.on('data', (d) => {
        string += d;
      });

      res.on('end', () => {
        resolve(string);
      }).on('error', (e) => reject(e));
    });
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// problem template html
function addOuterHtml(source, a, extra) {
  const fixLinks = /(?<=")\/\/(?=latex)/gms;
  return `
  <div id="wrapper">
    <h2>${source}${extra}</h2>
    <div class="main">
      <div class="problem">
      ${a}
      </div>
    </div>
    <div class="footer">
      <div class="element">
        © 2020 MAA
      </div>
      <div class="element">
        © 2020 AoPS Inc.
      </div>
      <div class="element">
        ProblemsBot v${config.version}
      </div>
    </div>
  </div>`.replace(fixLinks, 'https://');
}

async function scrapeAMCWebsite(baseRate, variance) {
  const baseUrls = ['https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions'];
  const content = [];

  const bar1 = new cliProgress.SingleBar({
  }, cliProgress.Presets.legacy);
  bar1.start(baseUrls.length, 0);
  /* eslint-disable */
  for (let i of baseUrls) {
    content.push(await asyncHttps(i));

    const wait = baseRate + (Math.random() * 2 - 1) * variance;
    await sleep(wait);
    bar1.increment();
  }
  bar1.stop();
  /* eslint-enable */

  const getAllContestUrls = /(?<=a href=").*(?=" title="[0-9]{4} AMC)/gm;
  const contestUrls = content.map((c, i) => c.toString().match(getAllContestUrls)
    .map((d) => new URL(d, baseUrls[i]))).flat(1);

  const problemMatch = /(?<=<li><a href=").*?Problem_[0-9]{1,2}(?!.*page does not exist)/gm;

  const matchProblemHtml = /(?<=<h2><span class="mw-headline" id="Problem[_0-9]{0,3}">Problem[ 0-9]{0,3}<\/span><\/h2>\n).*?(?=<h2>)/gms;
  const matchSolutionHtml = /(?<=<h[0-9]><span.*?id="Solution.*?">Solution.*?<\/span><\/h[0-9]>\n).+?(?=<h[0-9]>)/gms;
  // get problem name
  const matchSource = /(?<=<span class="crumb crumb-3">).*?(?=<\/span)/gms;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 2048, deviceScaleFactor: 2 });

  async function screenshot(html) {
    await page.setContent(html);
    await page.addStyleTag({ path: './styles/problem.css' });
    await page.evaluate(() => { document.body.style.background = 'transparent'; });

    const element = await page.$('#wrapper');

    await page.evaluateHandle('document.fonts.ready');
    return element.screenshot({ omitBackground: true });
  }

  // fetch problem HTML
  /* eslint-disable */

  console.log(`${contestUrls.length} contests...`);
  const bar2 = new cliProgress.SingleBar({
  }, cliProgress.Presets.legacy);
  bar2.start(contestUrls.length * 25, 0);

  contestUrls.shift();
  contestUrls.shift();

  for (let i of contestUrls) {
    const probList = await asyncHttps(i);
    const arr = probList.toString().match(problemMatch);

    const problemUrls = arr.map((a) => new URL(a, i)).flat(1);

    const wait = baseRate + (Math.random() * 2 - 1) * variance;
    await sleep(wait);

    for (let k of problemUrls) {
      const wait2 = baseRate + (Math.random() * 2 - 1) * variance;
      // console.log(`Waiting for ${wait}ms...`)
      await sleep(wait2);

      const problemPage = await asyncHttps(k);

      bar2.increment();
      if (problemPage.toString().match(/These problems will not be release/gm)) {
        // console.log(`Skipping ${k.href} because it is not released.`);
        continue;
      }

      let problemHtml = problemPage.toString().match(matchProblemHtml);
      let solutionHtml = problemPage.toString().match(matchSolutionHtml);
      const source = problemPage.toString().match(matchSource).map((t) => t.trim('\t\r\n').replace('Problems/', ''));

      if (!(problemHtml && solutionHtml)) {
        // console.log(`Invalid results for ${k.href}. Skipping...`);
        continue;
      }

      // console.log(`Matched ${i.href}`);
      problemHtml = problemHtml.map((a) => addOuterHtml(source[0], a, ''));
      solutionHtml = solutionHtml.map((a) => addOuterHtml(source[0], a, ' Solution'));

      // console.log(`Rendering ${source[0]}...`);

      // const problemImg = await screenshot(problemHtml[0]);
      const problemImgs = [];

      for (let j of problemHtml) {
        const img = await screenshot(j);
        problemImgs.push(await image.create({ img }));
      }

      const solutionImgs = [];

      for (let j of solutionHtml) {
        const img = await screenshot(j);
        solutionImgs.push(await image.create({ img }));
      }

      const dbProblem = {
        difficulty: 5,
        text: '',
        name: '',
        figures: problemImgs,
        answerFigures: solutionImgs,
        problemHtml,
        solutionHtml,
        source: source[0],
        url: k.href,
      };

      await problem.create(dbProblem);
    }
  }
  bar2.stop();
  await browser.close();
}

scrapeAMCWebsite(2000, 800);

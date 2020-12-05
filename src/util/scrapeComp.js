import https from 'https';
// import { problem, image } from '../schema';

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

async function scrapeAMCWebsite(ratelimit) {
  const baseUrl = ['https://artofproblemsolving.com/wiki/index.php/AMC_12_Problems_and_Solutions', 'https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions'];
  const content = [];
  const contestUrls = [];

  for (let i = 0; i < baseUrl.length; i += 1) {
    /* eslint-disable-next-line */
    content.push(await asyncHttps(baseUrl[i]));
  }

  const getAllContestUrls = /(?<=a href=").*(?=" title="[0-9]{4} AMC)/gm;
  content.forEach((c) => {
    contestUrls.push(c.toString().match(getAllContestUrls));
  });

  console.log(`${contestUrls.length} competitions scraped`);
  const problems = [];

  let k = 0;
  let p = 0;
  /* eslint-disable */
  for (const i of contestUrls) {
    for (let j of i) {
      await sleep(ratelimit * k);
      const probUrl = new URL(j, baseUrl[p]);
      console.log(probUrl)
      problems.push(await asyncHttps(probUrl));
      console.log(problems[k]);
      k += 1;
    }
    p += 1;
  }
  /* eslint-enable */
}

scrapeAMCWebsite(1000);

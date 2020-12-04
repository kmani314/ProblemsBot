const db = require('../db');
const fs = require('fs');
const { problem, image } = require('../schema');
const https = require('https');
const url = require('url');

async function scrapeAMCWebsite(ratelimit) {
  const baseUrl = ['https://artofproblemsolving.com/wiki/index.php/AMC_12_Problems_and_Solutions', 'https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions'];
  const content = [];
  const contestUrls = [];


  for (let i = 0; i < baseUrl.length; i++) {
    content.push(await asyncHttps(baseUrl[i]));
  }

  const getAllContestUrls = /(?<=a href=").*(?=" title="[0-9]{4} AMC)/gm;
  content.forEach((c) => {
    contestUrls.push(c.toString().match(getAllContestUrls));
  });

  console.log(`${contestUrls.length} competitions scraped`);
  const problems = [];

  let k = 0, p = 0;
  for (let i of contestUrls) {
    for (let j of i) {
      await sleep(ratelimit * k);
      const probUrl = new URL(j, baseUrl[p]);
      console.log(probUrl)
      problems.push(await asyncHttps(probUrl));
      console.log(problems[k]);
      k++;
    }
    p++;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncHttps(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let string;
      if (res.statusCode != 200) reject();

      res.on('data', (d) => {
        string += d;
      });

      res.on('end', (d) => {
        resolve(string);
      }).on('error', (e) => reject(e));
    });
  });
}

scrapeAMCWebsite(1000);

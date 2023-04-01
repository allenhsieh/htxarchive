const axios = require('axios');
const cheerio = require('cheerio');
const { spawnSync } = require('child_process');

const url = 'https://www.theendhtx.com/';

axios.get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    const links = [];

    $('a[data-hook="ev-rsvp-button"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href) {
        links.push(href);
      }
    });

    links.forEach((link) => {
      const command = 'curl';
      const args = [
        '-X', 'POST',
        '-H', 'Accept: application/json',
        '-H', `Authorization: LOW ${process.env.ACCESS_KEY}:${process.env.SECRET}`,
        '-d', `url=${link}`,
        'https://web.archive.org/save',
      ];
      spawnSync(command, args, { stdio: 'inherit' });
    });
  })
  .catch((error) => {
    console.error(error);
  });

const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.theendhtx.com/';

async function crawl() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const rsvpButtons = $('a[data-hook="ev-rsvp-button"]');
    const hrefs = [];
    rsvpButtons.each((i, elem) => {
      hrefs.push($(elem).attr('href'));
    });
    console.log(hrefs);

    for (let i = 0; i < hrefs.length; i++) {
      await axios.post('https://web.archive.org/save', {
        url: hrefs[i]
      }, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'LOW myaccesskey:mysecret'
        }
      });
    }

    console.log('Crawling completed!');
  } catch (error) {
    console.error(error);
  }
}

crawl();


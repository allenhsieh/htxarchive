require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

const accessKey = process.env.MY_ACCESS_KEY;
const secret = process.env.MY_SECRET;

const url = "https://www.theendhtx.com/";

const fetchData = async () => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

const crawlWebsite = async () => {
  const $ = await fetchData();
  const hrefs = $('a[data-hook="ev-rsvp-button"]')
    .map((i, element) => $(element).attr("href"))
    .get();
  console.log("Oh man I hope I don't fuck this up");
  for (const href of hrefs) {
    try {
      await axios
        .post(
          "https://web.archive.org/save",
          {
            url: href,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: `LOW ${accessKey}:${secret}`,
            },
          }
        )
        .then((response) => {
          console.log("Response status: ", response.status);
          if (response.status === 200) {
            console.log(JSON.stringify(response));
          }
          return response.data;
        });
      // console.log(`Saved ${href} to archive.org`);
    } catch (error) {
      console.log("You fucked up dummy, lol");
      console.error(`Error saving ${href} to archive: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  console.log("You didn't fuck up! Yay!");
};

crawlWebsite();

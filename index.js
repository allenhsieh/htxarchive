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

const archiveVenueEvents = async () => {
  try {
    const $ = await fetchData();
    const hrefs = $('a[data-hook="ev-rsvp-button"]')
      .map((i, element) => $(element).attr("href"))
      .get();
    for (const href of hrefs) {
      try {
        const response = await axios.post(
          "https://web.archive.org/save",
          { url: href },
          {
            headers: {
              Accept: "application/json",
              Authorization: `LOW ${accessKey}:${secret}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log(
          `${response.data.url} has been saved to archive.org with the job_id: ${response.data.job_id}`
        );
      } catch (error) {
        console.error(`Error saving ${href} to archive.org: ${error.message}`);
      }
    }
  } catch (error) {
    console.log("YOU FUCKED UP, DUMMY");
    console.error(`Error fetching data: ${error.message}`);
  }
  console.log("You didn't fuck up! Yay!");
};

archiveVenueEvents();

const { JSDOM } = require("jsdom");
const axios = require("axios");

const extractOGData = (html) => {
  const dom = new JSDOM(html);
  const metaTags = dom.window.document.querySelectorAll("meta");
  const ogData = {};

  metaTags.forEach((tag) => {
    if (
      tag.getAttribute("property") &&
      tag.getAttribute("property").startsWith("og:")
    ) {
      const property = tag.getAttribute("property").slice(3);
      ogData[property] = tag.getAttribute("content");
    }
  });

  if (Object.keys(ogData).length === 0) {
    return null;
  }

  return ogData;
};

exports.handler = async function (event, context) {
  const { report } = JSON.parse(event.body);
  const newReport = [];
  const promises = report.map(async (item) => {
    const currentURL = item.url;
    try {
      const response = await axios.get(currentURL);
      if (response.status > 399) {
        console.error(`--Error fetching ${currentURL}: ${response.status}`);
      }
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("text/html")) {
        console.error(`Non-HTML response for ${currentURL}`);
        return {
          item,
        };
      }

      const htmlBody = response.data;
      const newOGData = extractOGData(htmlBody);
      return {
        url: currentURL,
        hits: item.hits,
        ogData: newOGData,
      };
    } catch (error) {
      console.error(`Error fetching ${currentURL}: ${error.message}`);
    }
  });

  const results = await Promise.all(promises);
  newReport.push(...results);

  return {
    statusCode: 200,
    body: JSON.stringify({ newReport }),
  };
};

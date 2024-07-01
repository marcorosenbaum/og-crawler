const normalizeUrl = require("@esm2cjs/normalize-url").default;
const { JSDOM } = require("jsdom");
const axios = require("axios");

const { generateReport } = require("./report");
const { extractOGData } = require("./extractOGData");
const { getURLsFromHTML } = require("./getURLsFromHTML");

let fetch = import("node-fetch").then((module) => {
  fetch = module.default;
});

// FN crawls the given URL and returns a pages object with the count of each page and its OG data
const crawlPage = async (baseURL, currentURL, pages) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  // Normalize the URL to avoid duplicates
  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL]) {
    pages[normalizedCurrentURL].count++;
    return pages;
  }

  pages[normalizedCurrentURL] = { count: 1, ogData: null };

  // console.log(`Crawling ${currentURL}`);

  try {
    const response = await axios.get(currentURL);
    if (response.status > 399) {
      console.error(`--Error fetching ${currentURL}: ${response.status}`);
      return pages;
    }
    const contentType = response.headers["content-type"];
    if (!contentType || !contentType.includes("text/html")) {
      console.error(`Non-HTML response for ${currentURL}`);
      return pages;
    }

    // Get HTML body of url in response
    const htmlBody = response.data;

    // Extract OG data from HTML body and add to pages object
    // pages[normalizedCurrentURL].ogData = extractOGData(htmlBody);

    // Get URLs from HTML body and crawl each of them
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    const nextPages = await Promise.all(
      nextURLs.map(async (nextURL) => {
        pages = await crawlPage(baseURL, nextURL, pages);
      })
    );
    nextPages.forEach((page) => {
      Object.assign(pages, page);
    });
  } catch (error) {
    console.error(`Error fetching ${currentURL}: ${error.message}`);
  }

  return pages;
};

const normalizeURL = (url) => {
  return normalizeUrl(url, { stripWWW: false });
};

exports.handler = async function (event, context) {
  const { url } = JSON.parse(event.body);
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL is required" }),
    };
  }

  try {
    const pages = await crawlPage(url, url, {});
    const report = generateReport(pages);
    return {
      statusCode: 200,
      body: JSON.stringify({ url, report }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

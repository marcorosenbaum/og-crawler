const normalizeUrl = require("@esm2cjs/normalize-url").default;
const { JSDOM } = require("jsdom");
const axios = require("axios");

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

  console.log(`Crawling ${currentURL}`);

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
    pages[normalizedCurrentURL].ogData = extractOGData(htmlBody);

    // Get URLs from HTML body and crawl each of them
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.error(`Error fetching ${currentURL}: ${error.message}`);
  }

  return pages;
};

const normalizeURL = (url) => {
  return normalizeUrl(url, { stripWWW: false });
};

// FN to extract URLs from HTML body
const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    let href = linkElement.href;
    if (href.startsWith("/")) {
      href = new URL(href, baseURL).href;
    }
    try {
      const urlObj = new URL(href);
      urls.push(urlObj.href);
    } catch (error) {
      console.error(`Invalid URL ${href}: ${error.message}`);
    }
  }
  return urls;
};

// FN to extract OG data from HTML body
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
const { generateReport } = require("./report");

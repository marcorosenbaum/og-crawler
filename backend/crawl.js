// backend/crawl.js
const normalizeUrl = require("@esm2cjs/normalize-url").default;
const { JSDOM } = require("jsdom");
// const fetch = require("node-fetch");
// Ensure node-fetch is installed

let fetch;
import("node-fetch").then((module) => {
  fetch = module.default; // Ensure to use .default with ES modules
});

const crawlPage = async (baseURL, currentURL, pages) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL]) {
    pages[normalizedCurrentURL].count++;
    return pages;
  }

  pages[normalizedCurrentURL] = { count: 1, ogData: null };

  console.log(`Crawling ${currentURL}`);

  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.error(`Error fetching ${currentURL}: ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.error(`Non-HTML response for ${currentURL}`);
      return pages;
    }

    const htmlBody = await response.text();

    pages[normalizedCurrentURL].ogData = extractOGData(htmlBody);

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

const extractOGData = (html) => {
  const dom = new JSDOM(html);
  const metaTags = dom.window.document.querySelectorAll("meta");
  const ogData = {};

  console.log(`- - - - META TAGS: ${metaTags}`);

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
    return null; // Return null if no OG metadata found
  }

  return ogData;
};

module.exports = { crawlPage };

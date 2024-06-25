// backend/crawl.js
const normalizeUrl = require("@esm2cjs/normalize-url").default;
const { JSDOM } = require("jsdom");
// const fetch = require("node-fetch");
// Make sure to add node-fetch

let fetch;

const crawlPage = async (baseURL, currentURL, pages) => {
  if (!fetch) {
    fetch = (await import("node-fetch")).default;
  }
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

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

module.exports = { crawlPage };

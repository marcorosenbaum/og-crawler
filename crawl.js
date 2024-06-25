const normalizeUrl = require("@esm2cjs/normalize-url").default;
const { JSDOM } = require("jsdom");

const crawlPage = async (currentURL) => {
  console.log(`actively crawling ${currentURL}`);
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(`Error fetching ${currentURL}: ${response.status}`);
      return;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`None html respone for ${currentURL}`);
    }

    console.log(await response.text());
  } catch (error) {
    console.log(`Error fetching ${currentURL}: ${error.message}`);
  }
};

const normalizeURL = (url) => {
  const normalizedUrl = normalizeUrl(url);
  return normalizedUrl;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // relative URL
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Error with relative url: ${error.message}`);
      }
    } else {
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Error with absolute url: ${error.message}`);
      }
    }
  }

  return urls;
};

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };

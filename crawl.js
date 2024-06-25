const normalizeUrl = require("@esm2cjs/normalize-url").default;
const { JSDOM } = require("jsdom");

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

module.exports = { normalizeURL, getURLsFromHTML };

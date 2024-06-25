const normalizeUrl = require("@esm2cjs/normalize-url").default;
const { JSDOM } = require("jsdom");

const crawlPage = async (baseURL, currentURL, pages) => {
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

  console.log(`actively crawling ${currentURL}`);

  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.error(`- - Error fetching ${currentURL}: ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.error(`- - None html respone for ${currentURL}`);
      return pages;
    }

    const htmlBody = await response.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.error(`- - Error fetching ${currentURL}: ${error.message}`);
  }
  return pages;
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
        console.error(`- - Error with relative url: ${error.message}`);
      }
    } else {
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (error) {
        console.error(
          `- - Error with absolute url: ${linkElement.href}: ${error.message}`
        );
      }
    }
  }

  return urls;
};

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };

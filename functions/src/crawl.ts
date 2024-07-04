import normalizeUrl from "@esm2cjs/normalize-url";
import axios from "axios";

import { generateReport } from "./report";
import { getURLsFromHTML } from "./getURLsFromHTML";

// interface Page {
//   url: string;
//   count: number;
//   ogData: any;
// }

// FN crawls the given URL and returns a pages object
// with the count of each page and its OG data
const crawlPage = async (baseURL: string, currentURL: string, pages: any) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL, baseURL);
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
  } catch (error: any) {
    console.error(`Error fetching ${currentURL}: ${error.message}`);
  }

  return pages;
};

const normalizeURL = (url: string) => {
  return normalizeUrl(url, { stripWWW: false });
};

exports.handler = async function (event: Request) {
  if (event.body !== null) {
    const { url } = JSON.parse(event.body.toString());
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
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};

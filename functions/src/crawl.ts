import normalizeUrl from "@esm2cjs/normalize-url";
import axios from "axios";
import xml2js from "xml2js";

import { generateReport } from "./report";
import { getURLsFromHTML } from "./getURLsFromHTML";

// interface Page {
//   string: {
//     count: number;
//     ogData: any;
//   };
// }

const crawlPage = async (
  baseURL: string,
  currentURL: string,
  pages: Record<string, { count: number; ogData: any }>
) => {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL, baseURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

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

    const htmlBody = response.data;

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
      const normalizedURL = normalizeURL(url);
      const sitemap = await axios.get(`${normalizedURL}/sitemap.xml`);

      if (!sitemap) {
        console.log("No sitemap found");
        const pages = await crawlPage(url, url, {});
        const report = generateReport(pages);
        return {
          statusCode: 200,
          body: JSON.stringify({ url, report }),
        };
      } else if (sitemap) {
        console.log("Sitemap found");
        const parser = new xml2js.Parser();
        const sitemapData = await parser.parseStringPromise(sitemap.data);
        const urls = sitemapData.urlset.url.map((url: any) => url.loc[0]);
        const report = urls.map((url: string) => ({
          url,
          count: 1,
          ogData: null,
        }));

        return {
          statusCode: 200,
          body: JSON.stringify({ url, report }),
        };
      }
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};

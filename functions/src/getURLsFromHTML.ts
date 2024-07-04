import { JSDOM } from "jsdom";

const getURLsFromHTML = (htmlBody: string, baseURL: string) => {
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
    } catch (error: any) {
      console.error(`Invalid URL ${href}: ${error.message}`);
    }
  }
  return urls;
};

export { getURLsFromHTML };

const { JSDOM } = require("jsdom");
const axios = require("axios");

interface Page {
  url: string;
  count: number;
  ogData: any;
}

interface OGData {
  [key: string]: string;
}

const extractOGData = (html: string) => {
  const dom = new JSDOM(html);
  const metaTags = dom.window.document.querySelectorAll("meta");
  const ogData: OGData = {};

  metaTags.forEach((tag: HTMLMetaElement) => {
    const propertyAttr = tag.getAttribute("property");
    if (propertyAttr && propertyAttr.startsWith("og:")) {
      const property = propertyAttr.slice(3);
      const content = tag.getAttribute("content");
      if (content !== null) {
        ogData[property] = content;
      }
    }
  });

  if (Object.keys(ogData).length === 0) {
    return null;
  }

  return ogData;
};

exports.handler = async function (event: Request) {
  let result = {};
  if (event.body !== null) {
    const item: Page = JSON.parse(event.body.toString());

    const currentURL = item.url;

    try {
      const response = await axios.get(currentURL);
      if (response.status > 399) {
        console.error(`--Error fetching ${currentURL}: ${response.status}`);
        result = item; //???
      }
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("text/html")) {
        console.error(`Non-HTML response for ${currentURL}`);
        result = item; //???
      }

      const htmlBody = response.data;
      const newOGData = extractOGData(htmlBody);
      result = {
        url: currentURL,
        count: item.count,
        ogData: newOGData,
      };
    } catch (error: any) {
      console.error(`Error fetching ${currentURL}: ${error.message}`);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  };
};

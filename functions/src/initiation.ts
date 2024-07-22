import axios from "axios";
import xml2js from "xml2js";

import getOgData from "./get-og-data.js";

interface Page {
  url: string | null;
  ogData: OgData | null;
}

interface OgData {
  title: string;
  description: string;
  image: string;
}
let report: Page[] | null = [];

const initiation = async (url: string) => {
  let urls: string[] | null = [];

  const setData = async () => {
    const results = await Promise.allSettled(
      urls?.map(async (url: string) => {
        return await getOgData(url);
      }) || []
    );
    report = results
      .filter((result) => result !== null)
      .map((result) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          return {
            url: result.reason.url,
            ogData: { title: null, description: null, image: null },
          };
        }
      }) as Page[];
  };

  try {
    const sitemap = await axios.get(`${url}/sitemap.xml`);
    const parser = new xml2js.Parser();
    const sitemapData = await parser.parseStringPromise(sitemap.data);
    urls = sitemapData.urlset.url.map((url: any) => url.loc[0]);
    if (urls) {
      urls = urls.slice(0, 5);
    }
  } catch (e) {
    console.error("No sitemap found, generating urls from the website");
  }

  try {
    if (urls && urls.length > 0) {
      await setData();
    }
  } catch (e: any) {
    console.error("_ERROR_", e.message);
  }
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
      await initiation(url);

      return {
        statusCode: 200,
        body: JSON.stringify(report),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};

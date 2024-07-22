import cheerio from "cheerio";
import axios from "axios";

const getOgDataForSpa = async (url: string) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $("meta[property='og:title']").attr("content") || "";
    const description =
      $("meta[property='og:description']").attr("content") || "";
    const image = $("meta[property='og:image']").attr("content") || "";

    return { url, ogData: { title, description, image } };
  } catch (e: any) {
    console.log("__ERROR_", e.message);
    return null;
  }
};

export default getOgDataForSpa;

const { JSDOM } = require("jsdom");

const extractOGData = (html) => {
  const dom = new JSDOM(html);
  const metaTags = dom.window.document.querySelectorAll("meta");
  const ogData = {};

  metaTags.forEach((tag) => {
    if (
      tag.getAttribute("property") &&
      tag.getAttribute("property").startsWith("og:")
    ) {
      const property = tag.getAttribute("property").slice(3);
      ogData[property] = tag.getAttribute("content");
    }
  });

  if (Object.keys(ogData).length === 0) {
    return null;
  }

  return ogData;
};

module.exports = { extractOGData };

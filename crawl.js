const normalizeUrl = require("@esm2cjs/normalize-url").default;

const normalizeURL = (url) => {
  const normalizedUrl = normalizeUrl(url);
  return normalizedUrl;
};

module.exports = { normalizeURL };

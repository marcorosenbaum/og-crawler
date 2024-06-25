const { normalizeURL } = require("./crawl");
const { expect, test } = require("@jest/globals");

test("normalizeURL", () => {
  const input = "HTTP://www.Example.com/path";
  const actual = normalizeURL(input);
  const expected = "http://example.com/path";
  expect(actual).toEqual(expected);
});

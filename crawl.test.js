const { normalizeURL, getURLsFromHTML } = require("./crawl");
const { expect, test } = require("@jest/globals");

test("normalizeURL", () => {
  const input = "HTTP://www.Example.com/path";
  const actual = normalizeURL(input);
  const expected = "http://example.com/path";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML, absolute", () => {
  const inputHTMLBody = `<html>
    <body>
    <a href="http://example.com/path1">Link 1</a>
    </body>
    </html>`;
  const inputBaseURL = "http://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["http://example.com/path1"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML, relative", () => {
  const inputHTMLBody = `<html>
      <body>
      <a href="/path1">Link 1</a>
      </body>
      </html>`;
  const inputBaseURL = "http://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["http://example.com/path1"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML, both", () => {
  const inputHTMLBody = `<html>
        <body>
         <a href="/path1">Link 1, relative</a>
        <a href="http://example.com/path2">Link 2, absolute</a>
        </body>
        </html>`;
  const inputBaseURL = "http://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["http://example.com/path1", "http://example.com/path2"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML, invalid", () => {
  const inputHTMLBody = `<html>
          <body>
           <a href="path1">Link 1, relative</a>
          
          </body>
          </html>`;
  const inputBaseURL = "http://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});

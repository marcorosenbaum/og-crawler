const { sortPages } = require("../functions/report");
const { expect, test } = require("@jest/globals");

test("sortPages, 2pages", () => {
  const input = {
    "https://coding-bootcamps.eu": 3,
    "https://coding-bootcamps.eu/about": 7,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://coding-bootcamps.eu/about", 7],
    ["https://coding-bootcamps.eu", 3],
  ];
  expect(actual).toEqual(expected);
});

test("sortPages 5 pages", () => {
  const input = {
    "https://coding-bootcamps.eu": 3,
    "https://coding-bootcamps.eu/path4": 17,
    "https://coding-bootcamps.eu/path3": 11,
    "https://coding-bootcamps.eu/path2": 1,
    "https://coding-bootcamps.eu/path1": 5,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://coding-bootcamps.eu/path4", 17],
    ["https://coding-bootcamps.eu/path3", 11],
    ["https://coding-bootcamps.eu/path1", 5],
    ["https://coding-bootcamps.eu", 3],
    ["https://coding-bootcamps.eu/path2", 1],
  ];
  expect(actual).toEqual(expected);
});

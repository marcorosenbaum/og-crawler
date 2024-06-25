// backend/report.js
function generateReport(pages) {
  const sortedPages = sortPages(pages);
  return sortedPages.map(([url, hits]) => ({ url, hits }));
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1] - a[1]);
  return pagesArray;
}

module.exports = { generateReport };

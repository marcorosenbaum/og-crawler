// backend/report.js
function generateReport(pages) {
  const sortedPages = sortPages(pages);
  return sortedPages.map(([url, data]) => ({
    url,
    hits: data.count,
    ogData: data.ogData,
  }));
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1].count - a[1].count);
  return pagesArray;
}

module.exports = { generateReport };

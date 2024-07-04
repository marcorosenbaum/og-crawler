interface Page {
  url: string;
  count: number;
  ogData: any;
}

function generateReport(pages: Page[]) {
  const sortedPages = sortPages(pages);
  return sortedPages.map(([url, data]) => ({
    url,
    count: data.count,
    ogData: data.ogData,
  }));
}

function sortPages(pages: Page[]) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => b[1].count - a[1].count);
  return pagesArray;
}

export { generateReport };

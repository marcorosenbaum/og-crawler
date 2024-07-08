interface Page {
  url: string;
  count: number;
  ogData: any;
}

// function generateReport(pages: Record<string, { count: number; ogData: any }>) {
function generateReport(pages: (Page | void)[]) {
  const sortedPages = sortPages(pages);
  return sortedPages.map(([url, data]) => ({
    url,
    count: isPage(data) ? data.count : 0,
    ogData: isPage(data) ? data.ogData : null,
  }));
}

function isPage(data: any): data is Page {
  return data && typeof data.count === "number" && data.ogData !== undefined;
}

function sortPages(pages: (Page | void)[]) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => {
    if (isPage(a[1]) && isPage(b[1])) {
      return b[1].count - a[1].count;
    }
    return 0;
  });
  return pagesArray;
}

export { generateReport };

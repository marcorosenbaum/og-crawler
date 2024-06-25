// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { crawlPage } = require("./crawl");
const { generateReport } = require("./report");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post("/crawl", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const pages = await crawlPage(url, url, {});
    const report = generateReport(pages);
    res.json({ url, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// frontend/src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import OGPreview from "./components/OGPreview/OGPreview";

function App() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setReport(null);

    try {
      setLoading(true);
      // use axios to send a POST request to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/crawl`,
        { url }
      );
      setReport(response.data.report);
      setLoading(false);
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div className="App">
      <h1>OG Crawler</h1>
      <p>Enter a URL to crawl and get Open Graph metadata.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit">Crawl</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Crawling page...</p>}
      {report && (
        <div>
          <h2>Report for {url}</h2>
          <ul>
            {report.map((item, index) => (
              <li key={index}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>{" "}
                - Link was {item.hits} times found on the page.
                <OGPreview ogData={item.ogData} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

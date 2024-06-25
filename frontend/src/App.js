// frontend/src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Optionally add styling here

function App() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setReport(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/crawl`,
        { url }
      );
      setReport(response.data.report);
    } catch (error) {
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div className="App">
      <h1>Web Crawler</h1>
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
      {report && (
        <div>
          <h2>Report for {url}</h2>
          <ul>
            {report.map((item, index) => (
              <li key={index}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>{" "}
                - {item.hits} times
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

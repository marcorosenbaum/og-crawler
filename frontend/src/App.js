import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import OGReport from "./components/OGReport/OGReport";
import URLInput from "./components/URLInput/URLInput";

function App() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setReport(null);
    setLoading(true);

    try {
      // use axios to send a POST request to the backend
      const response = await axios.post("/.netlify/functions/crawl", { url });
      setReport(response.data.report);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div className="App flex flex-col gap-4">
      <h1 className="text-3xl font-bold mt-4">OG Crawler</h1>
      <p>Enter a URL to crawl and get Open Graph metadata.</p>
      <URLInput url={url} setUrl={setUrl} handleSubmit={handleSubmit} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p className="animate-pulse text-xl">Crawling page...</p>}
      {report && <OGReport report={report} />}
    </div>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import OGReport from "./components/OGReport/OGReport";
import URLInput from "./components/URLInput/URLInput";

function App() {
  const [url, setUrl] = useState("https://coding-bootcamps.eu");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ogDatafetched, setOgDatafetched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    setError(null);
    setOgDatafetched(false);

    try {
      const response = await axios.post("/.netlify/functions/crawl", { url });
      setReport(response.data.report);
    } catch (error) {
      setLoading(false);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div className="App flex flex-col gap-4">
      <h1 className="text-3xl font-bold mt-4">OG Crawler</h1>
      <p>Enter a URL to crawl and get Open Graph metadata.</p>
      <URLInput
        url={url}
        setUrl={setUrl}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && (
        <p className="animate-pulse text-xl text-green-600">Crawling page...</p>
      )}
      {ogDatafetched && (
        <p className="text-xl text-green-600">Finished crawling!</p>
      )}

      <OGReport
        report={report}
        loading={loading}
        setLoading={setLoading}
        ogDatafetched={ogDatafetched}
        setOgDatafetched={setOgDatafetched}
      />
    </div>
  );
}

export default App;

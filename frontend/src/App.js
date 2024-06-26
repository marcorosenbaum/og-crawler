import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import OGReport from "./components/OGReport/OGReport";
import URLInput from "./components/URLInput/URLInput";

function App() {
  const [url, setUrl] = useState("https://coding-bootcamps.eu");
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [OGDatafetched, setOGDatafetched] = useState(false);

  async function fetchOGData(report) {
    const response = await axios.post("/.netlify/functions/extractOGData", {
      report,
    });
    return response.data.newReport;
  }

  useEffect(() => {
    const fetchData = async () => {
      if (report && !OGDatafetched) {
        try {
          const OGReport = await fetchOGData(report);
          setReport((prevReport) => [...OGReport]);
          setOGDatafetched(true);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [report, OGDatafetched, setReport, setOGDatafetched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setReport(null);
    setOGDatafetched(false);
    setLoading(true);

    try {
      if (!OGDatafetched) {
        const response = await axios.post("/.netlify/functions/crawl", { url });
        setReport(response.data.report);
      }
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
      {OGDatafetched && <OGReport report={report} />}
    </div>
  );
}

export default App;

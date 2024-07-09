import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import OGReport from "./components/OGReport/OGReport";
import URLInput from "./components/URLInput/URLInput";

interface Report {
  url: string;
  count: number;
  ogData: {
    image: string;
    title: string;
    description: string;
  };
}
const App: React.FC = () => {
  const [url, setUrl] = useState<string>("https://coding-bootcamps.eu");
  const [report, setReport] = useState<Report[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ogDataFetched, setOgDataFetched] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    setError(null);
    setOgDataFetched(false);

    try {
      const response = await axios.post("/.netlify/functions/crawl", { url });
      setReport(response.data.report);
    } catch (error: any) {
      setLoading(false);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  return (
    <div className="App flex flex-col gap-4">
      <h1 className="text-3xl font-bold mt-4">OG Crawler</h1>
      <p>Enter an URL to get Open Graph meta data.</p>
      <URLInput
        url={url}
        setUrl={setUrl}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && (
        <p className="animate-pulse text-xl text-green-600">Getting data...</p>
      )}
      {ogDataFetched && (
        <p className="text-xl text-green-600">
          Finished! Found {report?.length} links. The OG preview is limit to 80.
          If you want to see a preview of all links, ...
        </p>
      )}

      <OGReport
        report={report}
        loading={loading}
        setLoading={setLoading}
        ogDataFetched={ogDataFetched}
        setOgDatafetched={setOgDataFetched}
      />
    </div>
  );
};

export default App;

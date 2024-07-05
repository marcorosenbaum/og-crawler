import React from "react";
import { useState, useEffect } from "react";
import OGLinkPreview from "../OGLinkPreview/OGLinkPreview";

import axios from "axios";

interface Report {
  url: string;
  count: number;
  ogData: {
    image: string;
    title: string;
    description: string;
  };
}

const OGReport: React.FC<{
  report: Report[] | null;
  ogDataFetched: boolean;
  loading: boolean;
  setLoading: (value: boolean) => void;
  setOgDatafetched: (value: boolean) => void;
}> = ({ report, loading, setLoading, ogDataFetched, setOgDatafetched }) => {
  const [newOGReport, setNewOGReport] = useState<Report[]>([]);

  async function fetchOGData(item: Report) {
    const response = await axios.post("/.netlify/functions/extractOGData", {
      url: item.url,
      count: item.count,
      ogData: item.ogData,
    });
    return response.data.result;
  }

  useEffect(() => {
    if (report === null) {
      setNewOGReport((prev) => []);
    }
  }, [report]);

  useEffect(() => {
    const fetchData = async () => {
      if (report && !ogDataFetched) {
        try {
          // set limit to 80 to avoid hitting the API rate limit
          // remember to give user feedback
          const maxLength = report.length > 80 ? 80 : report.length;
          for (let i = 0; i < maxLength; i++) {
            const OGItem = await fetchOGData(report[i]);
            setNewOGReport((prev) => [...prev, OGItem]);
          }
          setLoading(false);
          setOgDatafetched(true);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [report, ogDataFetched, setLoading, setNewOGReport, setOgDatafetched]);

  return (
    <div>
      <ul>
        {newOGReport.map((item, index) => (
          <li key={index}>
            <a
              href={item.url}
              className="text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.url}
            </a>
            <p>Link was found {item.count} times on the page.</p>
            <OGLinkPreview ogData={item.ogData} />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OGReport;

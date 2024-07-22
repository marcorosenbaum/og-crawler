import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import OGReport from "./components/OGReport/OGReport";
import URLInput from "./components/URLInput/URLInput";

interface Report {
  url: string;
  ogData: {
    image: string;
    title: string;
    description: string;
  };
}

// Images by https://unsplash.com/de/@joelvodell
const EXAMPLE_REPORT: Report[] = [
  {
    url: "https://placeholder-link.test",
    ogData: {
      image:
        "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Example title - 1",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime ratione ipsa omnis, repellendus nam a doloribus nobis, facere veniam commodi rem, fuga ea. Voluptate minima eveniet facere iste numquam. Deleniti!",
    },
  },
  {
    url: "https://placeholder-link.test",
    ogData: {
      image:
        "https://images.unsplash.com/photo-1542614362-4152151cf0cb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Example title - 2",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime ratione ipsa omnis, repellendus nam a doloribus nobis, facere veniam commodi rem, fuga ea. Voluptate minima eveniet facere iste numquam. Deleniti!",
    },
  },
  {
    url: "https://placeholder-link.test",
    ogData: {
      image:
        "https://images.unsplash.com/photo-1541550100490-3ea5cde169dd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Example title - 3",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime ratione ipsa omnis, repellendus nam a doloribus nobis, facere veniam commodi rem, fuga ea. Voluptate minima eveniet facere iste numquam. Deleniti!",
    },
  },
  {
    url: "https://placeholder-link.test",
    ogData: {
      image:
        "https://images.unsplash.com/photo-1520485292858-60fa55883e1e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Example title - 4",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime ratione ipsa omnis, repellendus nam a doloribus nobis, facere veniam commodi rem, fuga ea. Voluptate minima eveniet facere iste numquam. Deleniti!",
    },
  },
  {
    url: "https://placeholder-link.test",
    ogData: {
      image:
        "https://images.unsplash.com/photo-1519338284011-e00d355c8502?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Example title - 5",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime ratione ipsa omnis, repellendus nam a doloribus nobis, facere veniam commodi rem, fuga ea. Voluptate minima eveniet facere iste numquam. Deleniti!",
    },
  },
];

const App: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [report, setReport] = useState<Report[] | null>(EXAMPLE_REPORT);
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
      const response = await axios.post("/.netlify/functions/initiation", {
        url,
      });
      setReport(response.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(
        "An error occurred. Please try again and make sure the entered URL is a valid URL and contains a /sitemap.xml."
      );
      console.error(error);
    }
  };

  return (
    <div className="App flex flex-col gap-4">
      <p className="text-sm my-2">
        <b>Please note:</b>This is just a demo and its purpose is to show how
        the preview of the npm-package{" "}
        <a
          className="inline-block font-bold"
          href="https://www.npmjs.com/package/og-preview"
          target="_blank"
          rel="noreferrer"
        >
          og-preview
        </a>{" "}
        will look like.
      </p>
      <a
        href="https://www.npmjs.com/package/og-preview"
        target="_blank"
        rel="noreferrer"
        className="text-3xl font-bold mt-4"
      >
        og-preview demo
      </a>
      <p className="text-sm">
        Enter an URL to get a preview of how the links will appear when shared
        on social media platforms.
      </p>
      <URLInput
        url={url}
        setUrl={setUrl}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      {loading && (
        <p className="animate-pulse text-xl text-green-600">Getting data...</p>
      )}
      {error && <p className=" text-red-500">{error}</p>}

      <OGReport
        report={report}
        loading={loading}
        setLoading={setLoading}
        ogDataFetched={ogDataFetched}
      />
    </div>
  );
};

export default App;

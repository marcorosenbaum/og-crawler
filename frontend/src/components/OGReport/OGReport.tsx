import React from "react";
import OGLinkPreview from "../OGLinkPreview/OGLinkPreview";

interface Report {
  url: string;
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
}> = ({ report, setLoading }) => {
  return (
    <div>
      <ul>
        {report?.map((item, index) => (
          <li key={index}>
            <a
              href={item.url}
              className="text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.url}
            </a>

            <OGLinkPreview ogData={item.ogData} />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OGReport;

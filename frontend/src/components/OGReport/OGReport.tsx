import React from "react";
import OGLinkPreview from "../OGLinkPreview/OGLinkPreview";

interface Report {
  url: string;
  hits: number;
  ogData: {
    image: string;
    title: string;
    description: string;
  };
}

const OGReport: React.FC<{ report: Report[] }> = ({ report }) => {
  return (
    <div>
      <ul>
        {report.map((item, index) => (
          <li key={index}>
            <a
              href={item.url}
              className="text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.url}
            </a>
            <p>Link was found {item.hits} times on the page.</p>
            <OGLinkPreview ogData={item.ogData} />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OGReport;

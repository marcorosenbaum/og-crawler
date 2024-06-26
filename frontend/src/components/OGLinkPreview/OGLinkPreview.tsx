import React from "react";
// import not working, check and fix css module setup in tsconfig
// import classes from "./OGPreview.module.css";

interface OGData {
  image: string;
  title: string;
  description: string;
}

const OGPreview: React.FC<{ ogData: OGData }> = ({ ogData }) => {
  if (!ogData) {
    return <p className="text-red-500">No Open Graph metadata found.</p>;
  }

  return (
    <div className="flex  gap-8 border bg-gray-300 p-4">
      {ogData.image && (
        <img className="max-h-40" src={ogData.image} alt="OG preview" />
      )}
      <div className="text-center w-full">
        {ogData.title && (
          <h3 className="text-xl font-bold m-4">{ogData.title}</h3>
        )}
        {ogData.description && <p>{ogData.description}</p>}
      </div>
    </div>
  );
};

export default OGPreview;

import React from "react";

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
    <div className="flex  gap-8 border border-[#8a8a8a] rounded-xl bg-gray-300 p-4">
      {ogData.image ? (
        <img
          className="w-60 object-contain rounded-xl my-auto"
          src={ogData.image}
          alt="OG preview"
        />
      ) : (
        <div className="text-red-500 h-30">no open graph image found</div>
      )}
      <div className="text-left w-full ">
        {ogData.title ? (
          <h3 className="text-xl mb-2 font-bold">{ogData.title}</h3>
        ) : (
          <p className="text-red-500">no open graph title found</p>
        )}
        {ogData.description ? (
          <p>{ogData.description}</p>
        ) : (
          <p className="text-red-500">no open graph description found</p>
        )}
      </div>
    </div>
  );
};

export default OGPreview;

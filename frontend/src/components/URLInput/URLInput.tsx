import React from "react";

const URLInput: React.FC<{
  url: string;
  setUrl: (newUrl: string) => void;
  handleSubmit: () => void;
}> = ({ url, setUrl, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="border rounded"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <button
        type="submit"
        className="border rounded hover:bg-white  duration-300"
      >
        Crawl
      </button>
    </form>
  );
};

export default URLInput;

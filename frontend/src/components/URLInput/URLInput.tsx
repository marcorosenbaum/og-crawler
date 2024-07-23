import React from "react";

const URLInput: React.FC<{
  url: string;
  loading: boolean;
  setUrl: (newUrl: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}> = ({ url, loading, setUrl, handleSubmit }) => {
  const options = [
    "https://pinterest.de/",
    "https://netlify.com",
    "https://nodejs.org",
    "https://www.apple.com/",
  ];

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="border rounded"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="example: https://netlify.com"
      />
      <button
        disabled={loading}
        type="submit"
        className={`border mx-4 rounded duration-300 ${
          loading
            ? "opacity-45 text-black/50 cursor-not-allowed"
            : "hover:bg-white"
        }`}
      >
        Get Data
      </button>
    </form>
  );
};

export default URLInput;

import React from "react";

const URLInput: React.FC<{
  url: string;
  loading: boolean;
  setUrl: (newUrl: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}> = ({ url, loading, setUrl, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="border rounded"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="example: https://netlify.com"
      />
      <button
        disabled={loading}
        type="submit"
        className={`border rounded   duration-300 ${
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

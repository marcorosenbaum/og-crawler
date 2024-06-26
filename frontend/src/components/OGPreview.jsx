const OGPreview = ({ ogData }) => {
  if (!ogData) {
    return <p style={{ color: "red" }}>No Open Graph metadata found.</p>;
  }

  return (
    <div className="og-preview">
      {ogData.image && <img src={ogData.image} alt="OG preview" />}
      <div>
        {ogData.title && <h3>{ogData.title}</h3>}
        {ogData.description && <p>{ogData.description}</p>}
      </div>
    </div>
  );
};

export default OGPreview;

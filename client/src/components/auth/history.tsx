import { useEffect } from "react";
import { useAuth } from "../../context/authContext";

const HistoryPage = () => {
  const { files, loading, error, fetchFiles } = useAuth();

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Your Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>{file.originalName} - {file.status}</li>
        ))}
      </ul>
    </div>
  );
};
export default HistoryPage;
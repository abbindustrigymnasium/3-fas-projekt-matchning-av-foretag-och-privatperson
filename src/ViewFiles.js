import { useNavigate } from "react-router-dom";
import useFiles from "./hooks2/useFiles";
import useFileContent from "./hooks2/useFilesContent";
import useFileUpload from "./hooks2/useFileUpload";
import "./ViewFiles.css";
import pb from "./library/pocketbase";

export default function ViewFiles() {
    const navigate = useNavigate();
    const { files, notification, fetchFiles } = useFiles();
    const { fileContent, fetchFileContent } = useFileContent();
    const { selectedFiles, handleFileChange, handleFileUpload, setNotification } = useFileUpload();

    const handleLogout = () => {
        pb.authStore.clear();
        navigate("/");
    };

    return (
        <div className="view-files-container">
            <div className="header">
                <h1>Welcome to Your Files</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            <div className="centered">
                <h2>Your Files</h2>
                {files.length > 0 ? (
                    <ul>
                        {files.map((fileUrl, index) => (
                            <li key={index}>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        fetchFileContent(fileUrl);
                                    }}
                                >
                                    File {index + 1}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No files available.</p>
                )}
            </div>

            {fileContent && (
                <div className="file-content">
                    <h3>File Content:</h3>
                    <pre>{fileContent}</pre>
                </div>
            )}

            <div className="upload-section">
                <h3>Upload New Files</h3>
                <input
                    type="file"
                    multiple
                    accept=".txt"
                    onChange={handleFileChange}
                />
                <button onClick={() => handleFileUpload(fetchFiles)}>Upload Files</button>
                {notification && <p>{notification}</p>}
            </div>
        </div>
    );
}

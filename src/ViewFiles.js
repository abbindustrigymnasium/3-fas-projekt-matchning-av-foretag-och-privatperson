import { useNavigate, Link } from "react-router-dom";
import useFiles from "./hooksViewFiles/useFiles";
import useFileContent from "./hooksViewFiles/useFilesContent";
import useFileUpload from "./hooksViewFiles/useFileUpload";
import useAuth from "./hooksAuth/useAuth";
import "./ViewFiles.css";

export default function ViewFiles() {
    const navigate = useNavigate();
    const { files, notification, fetchFiles } = useFiles();
    const { fileContent, fetchFileContent } = useFileContent();
    const { selectedFiles, handleFileChange, handleFileUpload, setNotification } = useFileUpload();
    const { logout, isLoggedIn } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    };

    return (
        <div className="view-files-container">
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link to="/get-json">Job Listings</Link> {/* Updated to navigate to `getJSON` */}
                        </li>
                        {isLoggedIn && (
                            <li>
                                <Link to="/view-files">Upload Files</Link>
                            </li>
                        )}
                        <li>
                            <button
                                onClick={isLoggedIn ? handleLogout : handleLoginSignIn}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "inherit",
                                    textDecoration: "underline",
                                }}
                            >
                                {isLoggedIn ? "Log Out" : "Login/Sign In"}
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="container">
                <section className="jobs">
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
                </section>

                {fileContent && (
                    <div className="file-content">
                        <h3>File Content:</h3>
                        <pre>{fileContent}</pre>
                    </div>
                )}

                <div className="upload-section">
                    <h3>Upload New Files</h3>
                    {isLoggedIn ? (
                        <>
                            <input
                                type="file"
                                multiple
                                accept=".txt"
                                onChange={handleFileChange}
                            />
                            <button onClick={() => handleFileUpload(fetchFiles)}>Upload Files</button>
                        </>
                    ) : (
                        <p>You must be logged in to upload files.</p>
                    )}
                    {notification && <p>{notification}</p>}
                </div>
            </main>

            <footer>
                <p>&copy; 2025 Matchning.se. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

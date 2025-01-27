// Import necessary dependencies and custom hooks
import { useNavigate, Link } from "react-router-dom";  // Import hooks for page navigation and linking
import useFiles from "./hooks/useFilesViewFiles";   // Custom hook to manage file data (viewing files)
import useFileContent from "./hooks/useFilesContent"; // Custom hook to manage the content of the files
import useFileUpload from "./hooks/useFileUpload";  // Custom hook for file upload handling
import useAuth from "./hooks/useAuth";  // Custom hook for managing user authentication (login/logout)
import "./ViewFiles.css";  // Import the CSS specific to this component for styling

// Functional component to view and upload files
export default function ViewFiles() {
    // Initialize hooks
    const navigate = useNavigate(); // navigate function for programmatic page redirection
    const { files, notification, fetchFiles } = useFiles(); // Destructure file data, notification, and fetchFiles function from useFiles hook
    const { fileContent, fetchFileContent } = useFileContent(); // Destructure file content and fetchFileContent function from useFileContent hook
    const { handleFileChange, handleFileUpload } = useFileUpload(); // Destructure file change handler and file upload handler from useFileUpload hook
    const { logout, isLoggedIn } = useAuth();  // Destructure logout function and authentication state from useAuth hook

    // Function to handle logout operation
    const handleLogout = async () => {
        await logout();  // Perform logout action (remove user authentication data)
        navigate("/");  // Redirect to the home page after logging out
    };

    // Function to handle navigation to login page if user is not logged in
    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login");  // Redirect to the login page if user is not logged in
        }
    };

    return (
        <div className="view-files-container">
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        <li>
                            <Link to="/home">Home</Link>  {/* Navigation link to Home page */}
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>  {/* Navigation link to Profile page */}
                        </li>
                        <li>
                            <Link to="/get-json">Job Listings</Link>  {/* Navigation link to Job Listings page */}
                        </li>
                        {isLoggedIn && (  // Only show this link when user is logged in
                            <li>
                                <Link to="/view-files">Upload Files</Link>  {/* Navigation link to Upload Files page */}
                            </li>
                        )}
                        <li>
                            <button
                                onClick={isLoggedIn ? handleLogout : handleLoginSignIn}  // Toggle logout/login button behavior based on authentication state
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "inherit",
                                    textDecoration: "underline",
                                }}
                            >
                                {isLoggedIn ? "Log Out" : "Login/Sign In"}  {/* Button text changes based on login status */}
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="container">
                <section className="jobs">
                    <h2>Your Files</h2>
                    {files.length > 0 ? (  // If files are available, display them
                        <ul>
                            {files.map((fileUrl, index) => (  // Iterate over each file and display a download link
                                <li key={index}>
                                    <a
                                        href={fileUrl}  // File download link
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => {
                                            e.preventDefault();  // Prevent default link behavior
                                            fetchFileContent(fileUrl);  // Fetch file content when clicked
                                        }}
                                    >
                                        File {index + 1}  {/* Display file number */}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No files available.</p>  // Message displayed if no files are available
                    )}
                </section>

                {fileContent && (  // If file content is available, display it
                    <div className="file-content">
                        <h3>File Content:</h3>
                        <pre>{fileContent}</pre>  {/* Display file content */}
                    </div>
                )}

                <div className="upload-section">
                    <h3>Upload New Files</h3>
                    {isLoggedIn ? (  // Only show file upload section if user is logged in
                        <>
                            <input
                                type="file"
                                multiple
                                accept=".txt"
                                onChange={handleFileChange}  // Handle file input change
                            />
                            <button onClick={() => handleFileUpload(fetchFiles)}>Upload Files</button>  {/* Trigger file upload */}
                        </>
                    ) : (
                        <p>You must be logged in to upload files.</p>  /* Message displayed if user is not logged in */
                    )}
                    {notification && <p>{notification}</p>}  {/* Display notification message after file upload */}
                </div>
            </main>

            <footer>
                <p>&copy; 2025 Matchning.se. All Rights Reserved.</p>  {/* Footer with copyright */}
            </footer>
        </div>
    );
}

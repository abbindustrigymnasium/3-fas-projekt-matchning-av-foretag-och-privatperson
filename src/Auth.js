import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks1/useAuth";  // Custom hook for authentication
import useFiles from "./hooks1/useFiles";  // Custom hook for file management
import useFileReader from "./hooks1/useFileReader";  // Custom hook for file reading
import useNotification from "./hooks1/useNotification";  // Custom hook for notifications
import "./Auth.css";

export default function Auth() {
    const navigate = useNavigate();
    const { isLoggedIn, userName, recordId, authError, login, signUp, logout } = useAuth();
    const { files, notification, handleFileUpload, fetchFiles } = useFiles(recordId);
    const { readFile, fileContent, isReading, error } = useFileReader();
    const { setNotificationMessage } = useNotification();
    
    const [isSignUp, setIsSignUp] = useState(false);  // Toggle between login and signup
    const [selectedFiles, setSelectedFiles] = useState([]);  // Store selected files for upload

    useEffect(() => {
        if (isLoggedIn && recordId) {
            fetchFiles();  // Fetch files when logged in
        }
    }, [isLoggedIn, recordId, fetchFiles]);

    const onSubmitLogin = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const formData = new FormData(event.target); // Get form data
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
        };
    
        await login(data.email, data.password);
    };    

    const onSubmitSignUp = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const formData = new FormData(event.target); // Get form data
        const data = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password"),
        };
    
        await signUp(data.email, data.password, data.fullName);
    };

    // Handle file selection for upload
    const onFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    // Handle file upload
    const onFileUpload = async () => {
        if (selectedFiles.length === 0) {
            setNotificationMessage("Please select files to upload.");
            return;
        }
        handleFileUpload(selectedFiles);
    };

    // Handle file reading
    const onFileRead = (file) => {
        readFile(file);
    };

    const renderLoginForm = () => (
        <div className="auth-form">
            <h1>Log In</h1>
            <form onSubmit={onSubmitLogin}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            {authError && <p className="error-message">{authError}</p>}
            <p>
                Don't have an account?{" "}
                <span onClick={() => setIsSignUp(true)} className="link">Sign Up</span>
            </p>
        </div>
    );
    
    const renderSignUpForm = () => (
        <div className="auth-form">
            <h1>Sign Up</h1>
            <form onSubmit={onSubmitSignUp}>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            {authError && <p className="error-message">{authError}</p>}
            <p>
                Already have an account?{" "}
                <span onClick={() => setIsSignUp(false)} className="link">Log In</span>
            </p>
        </div>
    );    

    const renderLoggedInView = () => (
        <div className="logged-in-container">
            <h1>Welcome, {userName}</h1>
            <button onClick={logout}>Logout</button>
            <div>
                <h2>Your Files</h2>
                {files.length > 0 ? (
                    files.map((file, idx) => (
                        <div key={idx}>
                            <h3>{file.fileName}</h3>
                            <pre>{file.content}</pre>
                        </div>
                    ))
                ) : (
                    <p>No files found</p>
                )}
            </div>
            <input
                type="file"
                multiple
                onChange={onFileChange}
            />
            <button onClick={onFileUpload}>Upload Files</button>
            {notification && <p className="notification">{notification}</p>}
            {fileContent && !isReading && <pre>{fileContent}</pre>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );

    return (
        <div className="auth-container">
            {!isLoggedIn ? (
                isSignUp ? renderSignUpForm() : renderLoginForm()
            ) : renderLoggedInView()}
        </div>
    );
}

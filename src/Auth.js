import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooksAuth/useAuth"; // Custom hook for authentication
import useFiles from "./hooksAuth/useFiles"; // Custom hook for file management
import useFileReader from "./hooksAuth/useFileReader"; // Custom hook for file reading
import useNotification from "./hooksAuth/useNotification"; // Custom hook for notifications
import "./Auth.css";

export default function Auth() {
    const navigate = useNavigate();
    const { isLoggedIn, userName, recordId, authError, login, signUp, logout } = useAuth();
    const { files, notification, handleFileUpload, fetchFiles } = useFiles(recordId);
    const { readFile, fileContent, isReading, error } = useFileReader();
    const { setNotificationMessage } = useNotification();

    const [isSignUp, setIsSignUp] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (isLoggedIn && recordId) {
            fetchFiles();
            navigate("/home"); // Redirect to home after login if already logged in
        }
    }, [isLoggedIn, recordId, fetchFiles, navigate]);

    const onSubmitLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        // Attempt login and navigate to home if successful
        await login(data.email, data.password);

        if (isLoggedIn) {
            navigate("/home"); // Navigate to Home after successful login
        } else {
            setNotificationMessage("Login failed. Please try again.");
        }
    };

    const onSubmitSignUp = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password"),
        };
        await signUp(data.email, data.password, data.fullName);
    };

    const onFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const onFileUpload = async () => {
        if (selectedFiles.length === 0) {
            setNotificationMessage("Please select files to upload.");
            return;
        }
        handleFileUpload(selectedFiles);
    };

    const onFileRead = (file) => {
        readFile(file);
    };

    const navigateToUpload = () => {
        navigate("/view-files"); // Redirect to the ViewFiles component
    };

    return (
        <div className="auth-container">
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        <li><a href="#" onClick={() => navigate("/home")}>Home</a></li>
                        <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a href="#" onClick={() => navigate("/get-json")}>Job Listings</a></li> {/* Navigate to getJSON */}
                        {isLoggedIn && <li><a href="#" onClick={navigateToUpload}>Upload Files</a></li>} {/* Show this only when logged in */}
                        <li>
                            <a href="#" onClick={logout}>
                                {isLoggedIn ? "Log Out" : "Login/Sign In"}
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            {!isLoggedIn ? (
                isSignUp ? (
                    <section className="auth-modal">
                        <h2>Create an Account</h2>
                        <form onSubmit={onSubmitSignUp} className="auth-form">
                            <label htmlFor="fullName">Full Name:</label>
                            <input type="text" name="fullName" placeholder="Enter your name" required />
                            <label htmlFor="email">Email:</label>
                            <input type="email" name="email" placeholder="Enter your email" required />
                            <label htmlFor="password">Password:</label>
                            <input type="password" name="password" placeholder="Enter your password" required />
                            <button type="submit">Sign Up</button>
                        </form>
                        <p>
                            Already have an account? <button onClick={() => setIsSignUp(false)}>Log In</button>
                        </p>
                    </section>
                ) : (
                    <section className="auth-modal">
                        <h2>Log In</h2>
                        <form onSubmit={onSubmitLogin} className="auth-form">
                            <label htmlFor="email">Email:</label>
                            <input type="email" name="email" placeholder="Enter email" required />
                            <label htmlFor="password">Password:</label>
                            <input type="password" name="password" placeholder="Enter password" required />
                            <button type="submit">Log In</button>
                        </form>
                        <p>
                            Don't have an account? <button onClick={() => setIsSignUp(true)}>Sign Up</button>
                        </p>
                    </section>
                )
            ) : (
                <section className="profile">
                    <h2>Your Profile</h2>
                    <div className="profile-pic">
                        <img src="default-profile.jpg" alt="Profile Picture" />
                    </div>
                    <label htmlFor="name">Full Name:</label>
                    <input type="text" value={userName} placeholder="Enter your name" />
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={userName} placeholder="Enter your email" />
                    <label htmlFor="interests">Interests:</label>
                    <input type="text" placeholder="Enter your interests (comma-separated)" />
                    <label htmlFor="bio">Bio:</label>
                    <textarea rows="4" placeholder="Tell us about yourself..."></textarea>
                    <button onClick={logout}>Logout</button>
                </section>
            )}
        </div>
    );
}

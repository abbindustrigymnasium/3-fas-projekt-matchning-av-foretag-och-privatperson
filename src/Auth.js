import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import hook for navigation
import useAuth from "./hooks/useAuth"; // Custom hook for authentication logic
import useFiles from "./hooks/useFilesAuth"; // Custom hook for file-related actions
import useFileReader from "./hooks/useFileReader"; // Custom hook for reading files
import useNotification from "./hooks/useNotification"; // Custom hook for notifications
import "./Auth.css"; // Importing CSS for styling

export default function Auth() {
    const navigate = useNavigate(); // Hook for navigating between pages
    const { isLoggedIn, userName, recordId, authError, login, signUp, logout } = useAuth(); // Destructure auth-related functions and data from custom hook
    const { files, notification, handleFileUpload, fetchFiles } = useFiles(recordId); // Destructure file-related data and functions from custom hook
    const { readFile, fileContent, isReading, error } = useFileReader(); // Destructure file reading-related functions from custom hook
    const { setNotificationMessage } = useNotification(); // Custom hook for setting notification messages

    const [isSignUp, setIsSignUp] = useState(false); // State for toggling between Sign Up and Log In forms
    const [selectedFiles, setSelectedFiles] = useState([]); // State for managing selected files

    // Effect hook that runs when the component mounts or when authentication changes
    useEffect(() => {
        if (isLoggedIn && recordId) {
            fetchFiles(); // Fetch files if user is logged in and has a recordId
            navigate("/home"); // Redirect to the home page after successful login
        }
    }, [isLoggedIn, recordId, fetchFiles, navigate]); // Re-run effect when any of the dependencies change

    // Handle form submission for both log in and sign up
    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submit action
        const formData = new FormData(event.target); // Create FormData object to access form data
        const data = {
            email: formData.get("email"), // Extract email from form
            password: formData.get("password"), // Extract password from form
        };

        if (isSignUp) {
            const fullName = formData.get("fullName"); // Extract full name for sign up
            await signUp(data.email, data.password, fullName); // Call sign-up function
        } else {
            await login(data.email, data.password); // Call log-in function
            if (isLoggedIn) {
                navigate("/home"); // Redirect to home page on successful login
            } else {
                setNotificationMessage("Login failed. Please try again."); // Show login failure message
            }
        }
    };

    // Navigate to the file upload page
    const navigateToUpload = () => {
        navigate("/view-files"); // Redirect to the ViewFiles component
    };

    return (
        <div className="auth-container">
            {/* Navbar section */}
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        <li><a href="#" onClick={() => navigate("/home")}>Home</a></li>
                        <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a href="#" onClick={() => navigate("/get-json")}>Job Listings</a></li> 
                        {/* Conditional rendering of 'Upload Files' link based on login status */}
                        {isLoggedIn && <li><a href="#" onClick={navigateToUpload}>Upload Files</a></li>}
                        <li>
                            {/* Toggle between 'Log Out' and 'Login/Sign In' based on login status */}
                            <a href="#" onClick={logout}>
                                {isLoggedIn ? "Log Out" : "Login/Sign In"}
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Authentication modal for login/signup */}
            <section className="auth-modal">
                <h2>{isSignUp ? "Create an Account" : "Log In"}</h2>
                <form onSubmit={onSubmit} className="auth-form">
                    {/* Sign-up form fields */}
                    {isSignUp && (
                        <>
                            <label htmlFor="fullName">Full Name:</label>
                            <input type="text" name="fullName" placeholder="Enter your name" required />
                        </>
                    )}
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" placeholder="Enter your email" required />
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" placeholder="Enter your password" required />
                    <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
                </form>
                {/* Display error message if authentication fails */}
                {authError && <p className="error">{authError}</p>}
                {/* Toggle between login and sign-up forms */}
                <p>
                    {isSignUp ? (
                        <>
                            Already have an account? <button onClick={() => setIsSignUp(false)}>Log In</button>
                        </>
                    ) : (
                        <>
                            Don't have an account? <button onClick={() => setIsSignUp(true)}>Sign Up</button>
                        </>
                    )}
                </p>
            </section>

            {/* Profile section (only visible when logged in) */}
            {isLoggedIn && (
                <section className="profile">
                    <h2>Your Profile</h2>
                    <div className="profile-pic">
                        {/* Default profile picture */}
                        <img src="default-profile.jpg" alt="Profile Picture" />
                    </div>
                    <label htmlFor="name">Full Name:</label>
                    <input type="text" value={userName} placeholder="Enter your name" readOnly />
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={userName} placeholder="Enter your email" readOnly />
                    <label htmlFor="interests">Interests:</label>
                    <input type="text" placeholder="Enter your interests (comma-separated)" />
                    <label htmlFor="bio">Bio:</label>
                    <textarea rows="4" placeholder="Tell us about yourself..."></textarea>
                    {/* Logout button */}
                    <button onClick={logout}>Logout</button>
                </section>
            )}
        </div>
    );
}
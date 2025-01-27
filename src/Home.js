import React from "react";
import { useNavigate } from "react-router-dom"; // Import hook to navigate between routes
import useAuth from "./hooks/useAuth";  // Import custom hook for authentication logic

const Home = () => {
    const navigate = useNavigate(); // Hook to handle navigation
    const { logout, isLoggedIn } = useAuth();  // Destructure logout and isLoggedIn from useAuth

    // Function to handle user logout
    const handleLogout = async () => {
        await logout();  // Ensure the logout happens before navigation
        navigate("/");   // Navigate to the homepage after logout
    };

    // Function to navigate to login/sign-in page if the user is not logged in
    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login"); // Navigate to login page if not logged in
        }
    };

    // Function to navigate to file upload page
    const navigateToUpload = () => {
        navigate("/view-files");  // Redirect to the view files page
    };

    // Function to navigate to the "Get JSON" page
    const navigateToGetJSON = () => {
        navigate("/get-json");  // Redirect to the FetchJsonButton component
    };

    return (
        <div className="home-container">
            {/* Navigation Header */}
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        {/* Navigation links with conditional rendering based on login state */}
                        <li><a href="#" onClick={() => navigate("/home")}>Home</a></li> 
                        <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a href="#" onClick={navigateToGetJSON}>Job Listings</a></li> {/* Redirects to getJSON */}
                        {/* Show "Upload Files" option only when the user is logged in */}
                        {isLoggedIn && <li><a href="#" onClick={navigateToUpload}>Upload Files</a></li>}
                        {/* Conditionally render log out or login/sign-in option */}
                        <li>
                            <a href="#" onClick={isLoggedIn ? handleLogout : handleLoginSignIn}>
                                {isLoggedIn ? "Log Out" : "Login/Sign In"}
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main Section */}
            <main>
                <h2>Welcome to Matchning.se</h2>
                {/* Display different content based on the user's login state */}
                {isLoggedIn ? (
                    <p>You are logged in! You can now view your files or profile.</p>
                ) : (
                    <p>Please log in to access your account.</p>
                )}
            </main>

            {/* Footer Section */}
            <footer>
                <p>&copy; 2025 Matchning.se. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;

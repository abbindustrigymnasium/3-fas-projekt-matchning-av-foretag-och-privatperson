import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooksAuth/useAuth";  // Ensure you are importing useAuth

const Home = () => {
    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth();  // Destructure logout and isLoggedIn from useAuth

    const handleLogout = async () => {
        await logout();  // Ensure logout happens before navigation
        navigate("/");   // Navigate to homepage after logout
    };

    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    };

    const navigateToUpload = () => {
        navigate("/view-files");  // Redirect to the ViewFiles component (ensure this matches the route in App.js)
    };

    const navigateToGetJSON = () => {
        navigate("/get-json");  // Redirect to the FetchJsonButton component
    };

    return (
        <div className="home-container">
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        <li><a href="#" onClick={() => navigate("/home")}>Home</a></li> 
                        <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a href="#" onClick={navigateToGetJSON}>Job Listings</a></li> {/* Redirects to getJSON */}
                        {isLoggedIn && <li><a href="#" onClick={navigateToUpload}>Upload Files</a></li>} {/* Show this only when logged in */}
                        <li>
                            <a href="#" onClick={isLoggedIn ? handleLogout : handleLoginSignIn}>
                                {isLoggedIn ? "Log Out" : "Login/Sign In"}
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
                <h2>Welcome to Matchning.se</h2>
                {isLoggedIn ? (
                    <p>You are logged in! You can now view your files or profile.</p>
                ) : (
                    <p>Please log in to access your account.</p>
                )}
            </main>

            <footer>
                <p>&copy; 2025 Matchning.se. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;

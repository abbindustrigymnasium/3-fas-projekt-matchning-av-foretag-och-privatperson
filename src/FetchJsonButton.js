import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import hook for navigation
import useAuth from "./hooks/useAuth"; // Custom hook for authentication logic
import pb from "./library/pocketbase"; // Import the PocketBase instance for backend interaction
import { determineQualified, calculateMatchPercentage } from "./utils/algorithm"; // Import matching logic

const FetchJsonButton = () => {
    const navigate = useNavigate(); // Hook to navigate to different routes
    const { logout, isLoggedIn, dataId } = useAuth(); // Destructure authentication-related data and functions
    const [localDataId, setLocalDataId] = useState(dataId); // Store `dataId` locally to track user's ID
    const [results, setResults] = useState(null); // State to store the match results
    const [loading, setLoading] = useState(false); // State to track loading status
    const [error, setError] = useState(null); // State to store error messages

    // Effect hook that runs when the component mounts or when the `isLoggedIn` or `dataId` changes
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); // Redirect to login page if the user is not logged in
        } else {
            setLocalDataId(dataId); // Update local `dataId` when the logged-in user's ID changes
        }
    }, [isLoggedIn, dataId, navigate]);

    // Function to handle logging out
    const handleLogout = async () => {
        await logout(); // Call the logout function from `useAuth`
        navigate("/"); // Redirect to home page after logout
    };

    // Function to fetch user data from PocketBase based on the provided ID
    const fetchUserData = async (id) => {
        try {
            return await pb.collection("users").getOne(id); // Fetch the user's data from the "users" collection
        } catch (err) {
            throw new Error("Failed to fetch user data"); // Handle error if fetching fails
        }
    };

    // Function to handle navigation to login page if the user is not logged in
    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login"); // Navigate to login page if user is not logged in
        }
    };

    // Navigate to the file upload page
    const navigateToUpload = () => {
        navigate("/view-files"); // Redirect to the file upload page
    };

    // Function to fetch user data, compare, and calculate match percentage
    const fetchAndCompare = async () => {
        if (!localDataId) {
            setError("User not logged in"); // Show error if no user is logged in
            return;
        }

        setLoading(true); // Set loading state to true while processing
        setError(""); // Reset error message

        try {
            // Fetch the main user data
            const mainUser = await fetchUserData(localDataId);
            // Fetch all users from the "users" collection
            const allUsers = await pb.collection("users").getFullList();

            console.log("All Users:", allUsers); // Log the list of all users for debugging

            // Create a comparison dictionary for all users excluding the current user
            const comparisonDict = allUsers.reduce((acc, user) => {
                if (user.id !== localDataId) {
                    acc[user.id] = {
                        content: user.fileJSON.map((file) => file.content).join(", "), // Combine all file contents of the user
                        fullName: user.fullName, // Store the user's full name
                    };
                }
                return acc;
            }, {});

            // Create the main user dictionary to compare with others
            const mainDict = {
                content: mainUser.fileJSON.map((file) => file.content).join(", "), // Combine all file contents of the main user
            };

            // Get the list of qualified users based on the comparison
            const qualifiedUsers = determineQualified(comparisonDict, mainDict);
            console.log("Qualified Users:", qualifiedUsers); // Log qualified users for debugging

            // Calculate the match percentage for the qualified users
            const matchResults = calculateMatchPercentage(qualifiedUsers);

            setResults(matchResults); // Set the match results state with the calculated data
        } catch (err) {
            setError(err.message || "Error processing data"); // Set error state if any issue occurs during data fetching or processing
        } finally {
            setLoading(false); // Set loading state to false after processing is complete
        }
    };

    // Effect hook that re-fetches and compares data when `dataId` changes
    useEffect(() => {
        if (dataId) {
            fetchAndCompare(); // Call the fetch and compare function if `dataId` is available
        }
    }, [dataId]);

    return (
        <div className="get-json-container">
            {/* Navigation Header */}
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        <li><a href="#" onClick={() => navigate("/home")}>Home</a></li>
                        <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a href="#" onClick={() => navigate("/get-json")}>Job Listings</a></li>
                        {/* Conditionally render "Upload Files" option only if the user is logged in */}
                        {isLoggedIn && <li><a href="#" onClick={navigateToUpload}>Upload Files</a></li>}
                        {/* Toggle between "Log Out" and "Login/Sign In" based on login status */}
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
                <h2>Find Matches</h2>
                <button onClick={fetchAndCompare} disabled={loading}>
                    {loading ? "Processing..." : "Find Matches"} {/* Button text changes based on loading state */}
                </button>
                {/* Show error message if there's an error */}
                {error && <p className="error-message">{error}</p>}
                {/* Display the results if they are available */}
                {results && (
                    <div>
                        <h3>Matching Results:</h3>
                        <ul>
                            {Object.entries(results).map(([key, data]) => (
                                <li key={key}>
                                    Company name: {data.userName} 
                                    <br />
                                    Main Match Percentage: {Math.round(data.mainMatchPercentage)}% 
                                    <br />
                                    Matching Qualifications: {data.commonQualifications.join(", ")}
                                    <br />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>

            {/* Footer Section */}
            <footer>
                <p>&copy; 2025 Matchning.se. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default FetchJsonButton;

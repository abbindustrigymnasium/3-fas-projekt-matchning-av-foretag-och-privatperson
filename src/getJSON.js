import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./hooksAuth/useAuth"; // Ensure you are importing useAuth

const FetchJsonButton = () => {
    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth(); // Destructure logout and isLoggedIn from useAuth

    const [jsonData, setJsonData] = useState(null);
    const [recordIds, setRecordIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        await logout(); // Ensure logout happens before navigation
        navigate("/"); // Navigate to homepage after logout
    };

    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    };

    const navigateToUpload = () => {
        navigate("/view-files"); // Redirect to the ViewFiles component
    };

    const handleClick = async (recordId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:5000/get-json/${recordId}`);
            console.log("Response:", response.data);
            setJsonData(response.data); // 'response.data' contains the 'fileJSON' data
        } catch (err) {
            console.error("Error details:", err.response ? err.response.data : err.message);
            setError("Failed to fetch JSON data: " + (err.response ? err.response.data.error : err.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchAllRecordIds = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/get-json');
            if (response.data.error) {
                setError(response.data.error);  // Show error if there's any
            } else {
                setRecordIds(response.data.records.map(record => record.id)); // Store record IDs from the backend
            }
        } catch (err) {
            console.error("Error details:", err.response ? err.response.data : err.message);
            setError("Failed to fetch record IDs");
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div className="get-json-container">
            <header>
                <nav className="navbar">
                    <h1>Matchning.se</h1>
                    <ul className="nav-links">
                        <li><a href="#" onClick={() => navigate("/home")}>Home</a></li>
                        <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                        <li><a href="#" onClick={() => navigate("/get-json")}>Job Listings</a></li>
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
                <h2>Fetch JSON Data</h2>
                <button onClick={fetchAllRecordIds}>Get All Record IDs</button>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {recordIds.length > 0 && (
                    <div>
                        <h3>Record IDs:</h3>
                        <ul>
                            {recordIds.map((id) => (
                                <li key={id}>
                                    <button onClick={() => handleClick(id)}>
                                        Fetch Data for {id}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {jsonData ? (
                    <div>
                        <h3>JSON Data:</h3>
                        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                    </div>
                ) : (
                    <p>No data fetched yet.</p>
                )}
            </main>

            <footer>
                <p>&copy; 2025 Matchning.se. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default FetchJsonButton;

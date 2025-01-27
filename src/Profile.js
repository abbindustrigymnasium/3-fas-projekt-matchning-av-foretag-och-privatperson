import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";  // Import custom authentication hook
import pb from "./library/pocketbase";  // Import PocketBase instance for backend interaction
import "./Profile.css";  // Import CSS for the profile page

export default function Profile() {
    const navigate = useNavigate();  // Navigation hook to change routes
    const { logout } = useAuth();  // Extract the logout function from useAuth
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to track if the user is logged in
    const [profile, setProfile] = useState({
        bio: "",  // User's bio
        age: "",  // User's age
        gender: "",  // User's gender
    });
    const [notification, setNotification] = useState("");  // State for displaying notifications

    // useEffect hook runs once on component mount to check login status
    useEffect(() => {
        if (!pb.authStore.isValid) {
            navigate("/login");  // If user is not logged in, redirect to login page
        } else {
            setIsLoggedIn(true);  // Set login status to true if user is logged in
            fetchProfile();  // Fetch user's profile data
        }
    }, []);

    // Function to fetch user profile from PocketBase
    const fetchProfile = async () => {
        const recordId = pb.authStore.model?.id;  // Get current user's record ID
        if (!recordId) return;

        try {
            const userRecord = await pb.collection("users").getOne(recordId);  // Fetch user data
            setProfile({
                bio: userRecord.bio || "",
                age: userRecord.age || "",
                gender: userRecord.gender || "",
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            setNotification("Failed to load profile. Please try again.");  // Set error notification if fetch fails
        }
    };

    // Handle form input changes and update profile state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));  // Update the corresponding profile field
    };

    // Function to save profile updates to PocketBase
    const handleSaveProfile = async () => {
        const recordId = pb.authStore.model?.id;
        if (!recordId) return;

        try {
            await pb.collection("users").update(recordId, {  // Update profile in PocketBase
                bio: profile.bio,
                age: profile.age,
                gender: profile.gender,
            });
            setNotification("Profile updated successfully!");  // Show success notification
            navigate("/view-files");  // Redirect to file upload page after saving
        } catch (error) {
            console.error("Error saving profile:", error);
            setNotification("Failed to save profile. Please try again.");  // Show error notification
        }
    };

    // Logout the user and redirect to homepage
    const handleLogout = async () => {
        await logout();  // Call logout function from useAuth
        navigate("/");  // Redirect to homepage after logout
    };

    // Function to handle login redirection if user is not logged in
    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login");  // Redirect to login page if not logged in
        }
    };

    return (
        <div className="profile-container">
            {/* If the user is logged in, show the profile form */}
            {isLoggedIn ? (
                <>
                    <header>
                        <nav className="navbar">
                            <h1>Matchning.se</h1>
                            <ul className="nav-links">
                                <li><a href="#" onClick={() => navigate("/home")}>Home</a></li>
                                <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                                <li><a href="#" onClick={() => navigate("/get-json")}>Job Listings</a></li> {/* Link to Job Listings */}
                                {isLoggedIn && (
                                    <li>
                                        <a href="#" onClick={() => navigate("/view-files")}>Upload Files</a>  {/* Upload Files link */}
                                    </li>
                                )}
                                <li>
                                    <a href="#" onClick={isLoggedIn ? handleLogout : handleLoginSignIn}>
                                        {isLoggedIn ? "Log Out" : "Login/Sign In"}  {/* Conditional logout or login link */}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </header>

                    <main>
                        <h1>Your Profile</h1>
                        {notification && <p className="notification">{notification}</p>}  {/* Show notification if present */}

                        {/* Profile form for updating bio, age, and gender */}
                        <form className="profile-form">
                            <div className="form-group">
                                <label htmlFor="bio">Bio:</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleInputChange}
                                    placeholder="Write a short bio about yourself..."
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age:</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    value={profile.age}
                                    onChange={handleInputChange}
                                    placeholder="Enter your age"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">Gender:</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                className="save-button"
                                onClick={handleSaveProfile}
                            >
                                Save Profile
                            </button>
                        </form>
                    </main>
                </>
            ) : (
                <p>Redirecting to login...</p>  // Message shown while redirecting to login
            )}
        </div>
    );
}

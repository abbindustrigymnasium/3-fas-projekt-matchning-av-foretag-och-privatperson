import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooksAuth/useAuth";
import pb from "./library/pocketbase";
import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfile] = useState({
        bio: "",
        age: "",
        gender: "",
    });
    const [notification, setNotification] = useState("");

    useEffect(() => {
        // Check if the user is logged in
        if (!pb.authStore.isValid) {
            navigate("/login");
        } else {
            setIsLoggedIn(true);
            fetchProfile();
        }
    }, []);

    const fetchProfile = async () => {
        const recordId = pb.authStore.model?.id;
        if (!recordId) return;

        try {
            const userRecord = await pb.collection("users").getOne(recordId);
            setProfile({
                bio: userRecord.bio || "",
                age: userRecord.age || "",
                gender: userRecord.gender || "",
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            setNotification("Failed to load profile. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        const recordId = pb.authStore.model?.id;
        if (!recordId) return;

        try {
            await pb.collection("users").update(recordId, {
                bio: profile.bio,
                age: profile.age,
                gender: profile.gender,
            });
            setNotification("Profile updated successfully!");
            navigate("/view-files"); // Redirect to file upload page after saving profile
        } catch (error) {
            console.error("Error saving profile:", error);
            setNotification("Failed to save profile. Please try again.");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/"); // Navigate to homepage after logout
    };

    const handleLoginSignIn = () => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    };

    return (
        <div className="profile-container">
            {isLoggedIn ? (
                <>
                    <header>
                        <nav className="navbar">
                            <h1>Matchning.se</h1>
                            <ul className="nav-links">
                                <li><a href="#" onClick={() => navigate("/home")}>Home</a></li>
                                <li><a href="#" onClick={() => navigate("/profile")}>Profile</a></li>
                                <li><a href="#" onClick={() => navigate("/get-json")}>Job Listings</a></li> {/* Added route for getJSON */}
                                {isLoggedIn && (
                                    <li>
                                        <a href="#" onClick={() => navigate("/view-files")}>
                                            Upload Files
                                        </a>
                                    </li>
                                )}
                                <li>
                                    <a href="#" onClick={isLoggedIn ? handleLogout : handleLoginSignIn}>
                                        {isLoggedIn ? "Log Out" : "Login/Sign In"}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </header>

                    <main>
                        <h1>Your Profile</h1>
                        {notification && <p className="notification">{notification}</p>}

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
                <p>Redirecting to login...</p>
            )}
        </div>
    );
}

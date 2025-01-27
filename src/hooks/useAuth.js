// Import the PocketBase library instance and required React hooks
import pb from "../library/pocketbase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To handle navigation between routes

// Custom hook for authentication logic
export default function useAuth() {
    const navigate = useNavigate(); // Initialize the navigation function
    const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid); // Track authentication state
    const [userName, setUserName] = useState(""); // Store the authenticated user's name
    const [dataId, setdataId] = useState(pb.authStore?.model?.id || null); // Store the authenticated user's ID
    const [authError, setAuthError] = useState(""); // Store authentication error messages

    // React `useEffect` to set up a listener for changes in the PocketBase auth store
    useEffect(() => {
        const unsubscribe = pb.authStore.onChange(() => {
            // Update the authentication state when auth store changes
            setIsLoggedIn(pb.authStore.isValid); 
            setdataId(pb.authStore.model?.id || null);
            setUserName(pb.authStore.model?.email || "Unknown User"); // Default to "Unknown User" if email is unavailable
        });

        // Cleanup function to remove the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    // Function to handle user login
    const login = async (email, password) => {
        try {
            setAuthError(""); // Reset any previous error messages
            const authData = await pb.collection("users").authWithPassword(email, password); // Authenticate user
            setIsLoggedIn(true); // Update login state
            setdataId(authData.record.id); // Store authenticated user's ID
            setUserName(authData.record.email || "Unknown User"); // Store authenticated user's email
            navigate("/home"); // Navigate to the "view-files" page after successful login
        } catch (err) {
            setAuthError("Invalid email or password. Please try again."); // Display login error
        }
    };

    // Function to handle user sign-up
    const signUp = async (demail, dpassword, dfullName) => {
        try {
            setAuthError(""); // Reset any previous error messages
            if (!demail || !dpassword || !dfullName) {
                setAuthError("All fields are required."); // Validate input fields
                return;
            }

            // Create a new user in PocketBase with the provided details
            const data = {
                email: demail,
                password: dpassword,
                fullName: dfullName,
                passwordConfirm: dpassword // Ensure password confirmation matches
            };
            const user = await pb.collection("users").create(data);
            setIsLoggedIn(true); // Update login state
            setdataId(user.id); // Store new user's ID
            setUserName(user.email || "Unknown User"); // Store new user's email
            navigate("/home"); // Navigate to the "home" page after successful sign-up
        } catch (err) {
            console.error("Full error response:", err); // Log detailed error for debugging
            setAuthError("Sign-up failed. Please check the input data or try again."); // Display sign-up error
        }
    };

    // Function to handle user logout
    const logout = () => {
        pb.authStore.clear(); // Clear the auth store, logging the user out
        setIsLoggedIn(false); // Reset login state
        setdataId(null); // Clear user ID
        setUserName(""); // Clear username
        navigate("/"); // Redirect to the home page after logging out
    };

    // Return the state and authentication functions for use in components
    return { isLoggedIn, userName, dataId, authError, login, signUp, logout };
}
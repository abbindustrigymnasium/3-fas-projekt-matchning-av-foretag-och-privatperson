// Import necessary hooks and PocketBase instance
import { useState, useEffect } from "react";
import pb from "../library/pocketbase";

// Custom hook to manage and fetch files associated with a user
export default function useFiles() {
    // State to store the file URLs
    const [files, setFiles] = useState([]);

    // State to track whether files are being loaded
    const [loading, setLoading] = useState(false);

    // State to track if the files are currently being fetched
    const [isFetchingFiles, setIsFetchingFiles] = useState(false);

    // State to store any notification messages (e.g., errors or success)
    const [notification, setNotification] = useState("");

    // Function to fetch files for the authenticated user
    const fetchFiles = async () => {
        // Prevent multiple concurrent fetch requests
        if (isFetchingFiles) return;
        setIsFetchingFiles(true); // Set fetching state to true

        // Get the authenticated user's record ID from PocketBase
        const recordId = pb.authStore.model?.id;
        if (!recordId) return; // If no user is authenticated, exit

        // Create an AbortController to manage request cancellation
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            // Fetch the user record from the 'users' collection using the recordId
            const userRecord = await pb.collection("users").getOne(recordId, { signal });

            // Check if the user record exists and contains txtFiles
            if (userRecord && userRecord.txtFiles && userRecord.txtFiles.length > 0) {
                // Map over the txtFiles and generate their URLs
                const fileUrls = userRecord.txtFiles.map((file) =>
                    pb.files.getURL(userRecord, file) // Generate file URL
                );
                setFiles(fileUrls); // Update state with file URLs
            } else {
                setFiles([]); // No files found, reset the state
            }
        } catch (err) {
            // Handle fetch errors (ignore AbortError from cancellation)
            if (err.name !== "AbortError") {
                console.error("Error fetching files:", err);
                setNotification("Failed to load files. Please try again."); // Set error notification
            }
        } finally {
            setIsFetchingFiles(false); // Reset fetching state after the request completes
        }

        // Return the cleanup function to abort the request if the component unmounts
        return () => controller.abort();
    };

    // Function to trigger a refresh of files
    const refreshFiles = () => {
        fetchFiles(); // Calls fetchFiles to reload the user's files
    };

    // useEffect hook to fetch files on initial mount (if user is authenticated)
    useEffect(() => {
        if (pb.authStore.isValid) {
            fetchFiles(); // Fetch files if the user is authenticated
        }
    }, []); // Empty dependency array means it runs only once on component mount

    // Return the state and functions so they can be used in a component
    return { files, loading, notification, fetchFiles: refreshFiles, setNotification };
}

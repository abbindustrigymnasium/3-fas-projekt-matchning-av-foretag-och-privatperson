// Import React hooks and PocketBase instance
import { useState, useEffect } from "react";
import pb from "../library/pocketbase";

// Custom hook for managing files associated with a specific user record
export default function useFiles(recordId) {
    // State to store the list of fetched files
    const [files, setFiles] = useState([]);

    // State to indicate whether files are currently being fetched
    const [isFetchingFiles, setIsFetchingFiles] = useState(false);

    // State to store notifications (e.g., errors or success messages)
    const [notification, setNotification] = useState("");

    // Automatically fetch files when the `recordId` changes
    useEffect(() => {
        if (recordId) {
            fetchFiles(); // Fetch files for the given recordId
        }
    }, [recordId]);

    // Function to fetch files from PocketBase for the given record ID
    const fetchFiles = async () => {
        // Avoid duplicate requests if already fetching
        if (isFetchingFiles) return;
        setIsFetchingFiles(true); // Set fetching state to true

        const abortController = new AbortController(); // Create an abort controller
        const signal = abortController.signal; // Signal to control the request

        try {
            // Fetch the user record by `recordId`
            const userRecord = await pb.collection("users").getOne(recordId, { signal });

            // Check if the user record contains files
            if (userRecord && userRecord.files) {
                // Filter out .txt files from the file list
                const txtFiles = userRecord.files.filter(file => file.endsWith(".txt"));

                if (txtFiles.length > 0) {
                    // Fetch the content of each .txt file
                    const txtFileContent = await Promise.all(
                        txtFiles.map(async (fileName) => {
                            const fileUrl = pb.files.getURL(userRecord, fileName); // Get file URL
                            const response = await fetch(fileUrl, { signal }); // Fetch file content
                            return { fileName, content: await response.text() }; // Return file name and content
                        })
                    );

                    setFiles(txtFileContent); // Update the state with fetched files
                } else {
                    setNotification("No .txt files found."); // Notify if no .txt files exist
                }
            }
        } catch (err) {
            // Ignore errors caused by request cancellation
            if (err.name !== "AbortError") {
                setNotification("Error fetching files."); // Notify on other errors
            }
        } finally {
            setIsFetchingFiles(false); // Reset fetching state
        }
    };

    // Function to handle uploading files to PocketBase
    const handleFileUpload = async (selectedFiles) => {
        if (!selectedFiles.length) {
            setNotification("Please select files to upload."); // Notify if no files are selected
            return;
        }

        const formData = new FormData(); // Create a new FormData instance
        selectedFiles.forEach((file) => formData.append("txtFiles", file)); // Append files to the form data

        try {
            // Upload the files to the PocketBase server for the specified record
            await pb.collection("users").update(recordId, formData);
            setNotification("Files uploaded successfully!"); // Notify success
            fetchFiles(); // Refresh the file list after successful upload
        } catch (err) {
            setNotification("Failed to upload files. Please try again."); // Notify failure
        }
    };

    // Return the state and functions for external use
    return { 
        files,           // The list of fetched files
        notification,    // Notifications for errors or success messages
        fetchFiles,      // Function to fetch files
        handleFileUpload // Function to upload files
    };
};

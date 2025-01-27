// Import necessary hooks and PocketBase instance
import { useState } from "react";
import pb from "../library/pocketbase";

// Custom hook for handling file uploads and metadata
export default function useFileUpload() {
    // State to hold the selected files to be uploaded
    const [selectedFiles, setSelectedFiles] = useState([]);

    // State to store notification messages (e.g., success or error)
    const [notification, setNotification] = useState("");

    // Handler for file input change event (triggered when files are selected)
    const handleFileChange = (event) => {
        // Update the selectedFiles state with the files chosen by the user
        setSelectedFiles([...event.target.files]);
    };

    // Function to handle the file upload process
    const handleFileUpload = async (fetchFiles) => {
        // Check if files have been selected, show notification if none selected
        if (!selectedFiles || selectedFiles.length === 0) {
            setNotification("Please select files to upload.");
            return;
        }

        // Get the authenticated user's recordId
        const recordId = pb.authStore.model?.id;
        if (!recordId) {
            setNotification("User is not authenticated. Please log in.");
            return;
        }

        try {
            // Fetch the user's existing record (optional - here for JSON metadata handling)
            const userRecord = await pb.collection("users").getOne(recordId);

            // Clear existing file metadata (fileJSON) to start with an empty list
            const updatedFileJSON = [];

            // Prepare FormData to send with the file upload request
            const formData = new FormData();
            const filesToUpload = [];

            // Iterate over the selected files
            for (const file of selectedFiles) {
                // Read the file content as text
                const fileContent = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);  // Resolve when reading is complete
                    reader.onerror = () => reject("Error reading file"); // Reject on error
                    reader.readAsText(file);  // Read file content as text
                });

                // Add metadata for the current file to the updatedFileJSON
                updatedFileJSON.push({
                    fileName: file.name,  // File name
                    content: fileContent, // File content (text)
                    uploadedAt: new Date().toISOString(), // Timestamp when file was uploaded
                });

                // Add file to be uploaded
                filesToUpload.push(file);
            }

            // Append selected files to FormData
            filesToUpload.forEach((file) => formData.append("txtFiles", file));

            // Append the file metadata (updatedFileJSON) to FormData
            formData.append("fileJSON", JSON.stringify(updatedFileJSON));

            // Send the FormData (with the files and metadata) to PocketBase and update the user's record
            await pb.collection("users").update(recordId, formData);

            // Set notification for successful upload
            setNotification("Files and JSON content uploaded successfully!");

            // Clear selected files after successful upload
            setSelectedFiles([]);

            // Refresh the file list by calling the passed fetchFiles function
            fetchFiles();
        } catch (error) {
            // Handle errors and notify the user
            console.error("Error uploading files and JSON:", error);
            setNotification("Failed to upload files and JSON. Please try again.");
        }
    };

    // Return the state and functions to be used in the component
    return {
        selectedFiles,   // Array of files selected for upload
        notification,    // Notification message (success/error)
        handleFileChange, // Function to handle file input change event
        handleFileUpload, // Function to initiate the upload process
        setNotification,  // Function to set notification manually
    };
}
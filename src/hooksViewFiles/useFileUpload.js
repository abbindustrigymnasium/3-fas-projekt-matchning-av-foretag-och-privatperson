import { useState } from "react";
import pb from "../library/pocketbase";

export default function useFileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [notification, setNotification] = useState("");

    const handleFileChange = (event) => {
        setSelectedFiles([...event.target.files]);
    };

    const handleFileUpload = async (fetchFiles) => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setNotification("Please select files to upload.");
            return;
        }

        const recordId = pb.authStore.model?.id;
        if (!recordId) {
            setNotification("User is not authenticated. Please log in.");
            return;
        }

        try {
            // Get the user's record to retrieve existing JSON data
            const userRecord = await pb.collection("users").getOne(recordId);
            const existingFileJSON = userRecord.fileJSON || []; // Adjust field name as needed

            const updatedFileJSON = [...existingFileJSON]; // Clone existing JSON data

            const formData = new FormData();
            const filesToUpload = [];

            for (const file of selectedFiles) {
                // Read file content
                const fileContent = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject("Error reading file");
                    reader.readAsText(file);
                });

                // Add file JSON metadata
                updatedFileJSON.push({
                    fileName: file.name,
                    content: fileContent,
                    uploadedAt: new Date().toISOString(),
                });

                // Add file to be uploaded
                filesToUpload.push(file);
            }

            // Append new files to FormData
            filesToUpload.forEach((file) => formData.append("txtFiles", file));

            // Append updated JSON metadata to FormData
            formData.append("fileJSON", JSON.stringify(updatedFileJSON));

            // Send update request to PocketBase
            await pb.collection("users").update(recordId, formData);

            setNotification("Files and JSON content uploaded successfully!");
            setSelectedFiles([]);
            fetchFiles(); // Refresh the file list
        } catch (error) {
            console.error("Error uploading files and JSON:", error);
            setNotification("Failed to upload files and JSON. Please try again.");
        }
    };

    return {
        selectedFiles,
        notification,
        handleFileChange,
        handleFileUpload,
        setNotification,
    };
}
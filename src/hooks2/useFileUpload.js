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
        if (!recordId) return;

        const formData = new FormData();

        const userRecord = await pb.collection("users").getOne(recordId);
        const existingFiles = userRecord.txtFiles || [];
        existingFiles.forEach((file) => formData.append("txtFiles", file));

        selectedFiles.forEach((file) => formData.append("txtFiles", file));

        try {
            await pb.collection("users").update(recordId, formData);
            setNotification("Files uploaded successfully!");
            setSelectedFiles([]);
            fetchFiles(); // Refresh the files after uploading
        } catch (err) {
            console.error("Error uploading files:", err);
            setNotification("Failed to upload files. Please try again.");
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

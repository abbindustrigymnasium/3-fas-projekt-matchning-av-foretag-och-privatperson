import { useState, useEffect } from "react";
import pb from "../library/pocketbase";

export default function useFiles(recordId) {
    const [files, setFiles] = useState([]);
    const [isFetchingFiles, setIsFetchingFiles] = useState(false);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        if (recordId) {
            fetchFiles();
        }
    }, [recordId]);

    const fetchFiles = async () => {
        if (isFetchingFiles) return;
        setIsFetchingFiles(true);

        const abortController = new AbortController();
        const signal = abortController.signal;

        try {
            const userRecord = await pb.collection("users").getOne(recordId, { signal });

            if (userRecord && userRecord.files) {
                const txtFiles = userRecord.files.filter(file => file.endsWith(".txt"));
                if (txtFiles.length > 0) {
                    const txtFileContent = await Promise.all(
                        txtFiles.map(async (fileName) => {
                            const fileUrl = pb.files.getURL(userRecord, fileName);
                            const response = await fetch(fileUrl, { signal });
                            return { fileName, content: await response.text() };
                        })
                    );

                    setFiles(txtFileContent);
                } else {
                    setNotification("No .txt files found.");
                }
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                setNotification("Error fetching files.");
            }
        } finally {
            setIsFetchingFiles(false);
        }
    };

    const handleFileUpload = async (selectedFiles) => {
        if (!selectedFiles.length) {
            setNotification("Please select files to upload.");
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("txtFiles", file));

        try {
            await pb.collection("users").update(recordId, formData);
            setNotification("Files uploaded successfully!");
            fetchFiles(); // Refresh the file list
        } catch (err) {
            setNotification("Failed to upload files. Please try again.");
        }
    };

    return { files, notification, fetchFiles, handleFileUpload };
};

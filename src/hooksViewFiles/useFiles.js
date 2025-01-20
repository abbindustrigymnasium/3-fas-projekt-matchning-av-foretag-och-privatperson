import { useState, useEffect } from "react";
import pb from "../library/pocketbase";

export default function useFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFetchingFiles, setIsFetchingFiles] = useState(false);
    const [notification, setNotification] = useState("");

    const fetchFiles = async () => {
        if (isFetchingFiles) return;
        setIsFetchingFiles(true);

        const recordId = pb.authStore.model?.id;
        if (!recordId) return;

        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const userRecord = await pb.collection("users").getOne(recordId, { signal });

            if (userRecord && userRecord.txtFiles && userRecord.txtFiles.length > 0) {
                const fileUrls = userRecord.txtFiles.map((file) =>
                    pb.files.getURL(userRecord, file)
                );
                setFiles(fileUrls);
            } else {
                setFiles([]);
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Error fetching files:", err);
                setNotification("Failed to load files. Please try again.");
            }
        } finally {
            setIsFetchingFiles(false);
        }

        return () => controller.abort();
    };

    const refreshFiles = () => {
        fetchFiles();
    };

    useEffect(() => {
        if (pb.authStore.isValid) {
            fetchFiles();
        }
    }, []);

    return { files, loading, notification, fetchFiles: refreshFiles, setNotification };
}

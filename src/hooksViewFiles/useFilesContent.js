import { useState } from "react";

export default function useFileContent() {
    const [fileContent, setFileContent] = useState("");

    const fetchFileContent = async (fileUrl) => {
        setFileContent("");
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            setFileContent(text);
        } catch (err) {
            console.error("Error fetching file content:", err);
            setFileContent("Failed to fetch file content.");
        }
    };

    return { fileContent, fetchFileContent };
}

// Import React's useState hook
import { useState } from "react";

// Custom hook for fetching and managing the content of a file
export default function useFileContent() {
    // State to store the content of the fetched file
    const [fileContent, setFileContent] = useState("");

    // Function to fetch the content of a file given its URL
    const fetchFileContent = async (fileUrl) => {
        setFileContent(""); // Clear previous content before fetching new one
        try {
            // Fetch the file from the provided URL
            const response = await fetch(fileUrl);
            // Read the file content as text
            const text = await response.text();
            // Update the state with the fetched file content
            setFileContent(text);
        } catch (err) {
            // Handle any errors that occur during fetching
            console.error("Error fetching file content:", err);
            setFileContent("Failed to fetch file content."); // Provide a fallback message
        }
    };

    // Return the current file content and the function to fetch new content
    return { fileContent, fetchFileContent };
}

// Custom React hook to handle file reading
import { useState } from "react";

const useFileReader = () => {
    // State to store the content of the read file
    const [fileContent, setFileContent] = useState(null);

    // State to indicate whether a file is currently being read
    const [isReading, setIsReading] = useState(false);

    // State to store any errors encountered during file reading
    const [error, setError] = useState(null);

    // Function to handle reading a file using the FileReader API
    const readFile = (file) => {
        const reader = new FileReader(); // Create a new FileReader instance

        setIsReading(true); // Set the reading state to true
        setError(null); // Clear any previous errors

        // Event handler triggered when the file is successfully read
        reader.onload = (event) => {
            setFileContent(event.target.result); // Update file content with the result
            setIsReading(false); // Set reading state to false
        };

        // Event handler triggered if an error occurs during file reading
        reader.onerror = (error) => {
            setError(error); // Update the error state with the encountered error
            setIsReading(false); // Set reading state to false
        };

        // Start reading the file as text
        reader.readAsText(file);
    };

    // Return the hook's state and the `readFile` function
    return {
        fileContent, // The content of the read file
        isReading, // Indicates if a file is being read
        error, // Stores any errors during reading
        readFile, // Function to initiate the file reading
    };
};

export default useFileReader;

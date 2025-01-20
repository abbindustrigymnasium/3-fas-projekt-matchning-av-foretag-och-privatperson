// hooks/useFileReader.js
import { useState } from "react";
 
const useFileReader = () => {
    const [fileContent, setFileContent] = useState(null);
    const [isReading, setIsReading] = useState(false);
    const [error, setError] = useState(null);
 
    const readFile = (file) => {
        const reader = new FileReader();
 
        setIsReading(true);
        setError(null);
 
        reader.onload = (event) => {
            // Set file content after reading is complete
            setFileContent(event.target.result);
            setIsReading(false);
        };
 
        reader.onerror = (error) => {
            // Handle error during reading
            setError(error);
            setIsReading(false);
        };
 
        // Read the file as text
        reader.readAsText(file);
    };
 
    return {
        fileContent,
        isReading,
        error,
        readFile,
    };
};
 
export default useFileReader;
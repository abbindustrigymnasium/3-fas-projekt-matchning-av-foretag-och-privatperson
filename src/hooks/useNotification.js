// Importing the useState hook to manage the state of notifications
import { useState } from "react";

// Custom hook for managing notification messages
export default function useNotification() {
    // State variable to store the notification message
    const [notification, setNotification] = useState("");

    // Function to update the notification message
    const setNotificationMessage = (message) => {
        // Set the notification message
        setNotification(message);
    };

    // Return the current notification and the function to update it
    return { notification, setNotificationMessage };
};
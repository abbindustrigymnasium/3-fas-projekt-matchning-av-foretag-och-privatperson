import { useState } from "react";

export default function useNotification() {
    const [notification, setNotification] = useState("");

    const setNotificationMessage = (message) => {
        setNotification(message);
    };

    return { notification, setNotificationMessage };
};

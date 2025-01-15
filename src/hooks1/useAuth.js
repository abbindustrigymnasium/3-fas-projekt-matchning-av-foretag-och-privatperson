import { useState } from "react";
import pb from "../library/pocketbase";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid);
    const [userName, setUserName] = useState("");
    const [recordId, setRecordId] = useState(null);
    const [authError, setAuthError] = useState("");

    const login = async (email, password) => {
        try {
            setAuthError("");
            const authData = await pb.collection("users").authWithPassword(email, password);
            setIsLoggedIn(true);
            setRecordId(authData.record.id);
            setUserName(authData.record.email || "Unknown User");
            navigate("/view-files");
        } catch (err) {
            setAuthError("Invalid email or password. Please try again.");
        }
    };

    const signUp = async (email, password, fullName) => {
        try {
            setAuthError("");
            const user = await pb.collection("users").create({
                email,
                password,
                passwordConfirm: password,
                FullName: fullName,
            });
            setIsLoggedIn(true);
            setRecordId(user.id);
            setUserName(user.email || "Unknown User");
            navigate("/view-files");
        } catch (err) {
            setAuthError("Sign-up failed. This email might already be registered.");
        }
    };

    const logout = () => {
        pb.authStore.clear();
        setIsLoggedIn(false);
        setRecordId(null);
        setUserName("");
        navigate("/");
    };

    return { isLoggedIn, userName, recordId, authError, login, signUp, logout };
};

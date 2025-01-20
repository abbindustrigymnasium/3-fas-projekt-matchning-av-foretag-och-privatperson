import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Auth";
import ViewFiles from "./ViewFiles";
import Home from "./Home";
import Profile from "./Profile";
import FetchJsonButton from "./getJSON"; // Import the FetchJsonButton component

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect from root ("/") to "/home" */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Home route */}
                <Route path="/home" element={<Home />} />

                {/* Route for login/signup page */}
                <Route path="/login" element={<Auth />} />

                {/* Route for view files page */}
                <Route path="/view-files" element={<ViewFiles />} />

                {/* Route for profile page */}
                <Route path="/profile" element={<Profile />} />

                {/* Route for Fetch JSON page */}
                <Route path="/get-json" element={<FetchJsonButton />} />
            </Routes>
        </Router>
    );
}

export default App;

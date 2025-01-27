// Importing necessary components and hooks from React and React Router DOM
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; 
import Auth from "./Auth"; // Component for login and signup page
import ViewFiles from "./ViewFiles"; // Component for viewing files
import Home from "./Home"; // Component for the home page
import Profile from "./Profile"; // Component for the profile page
import FetchJsonButton from "./FetchJsonButton.js"; // Component for fetching JSON data

// The main App component that manages the routing of the application
function App() {
    return (
        // Wrapping the entire application with Router to enable routing capabilities
        <Router>
            {/* Defining routes using the Routes component */}
            <Routes>
                {/* Redirecting from the root ("/") path to the "/home" path */}
                {/* This ensures that whenever the user visits the root, they are automatically redirected to the home page */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Defining the route for the home page */}
                {/* When the user navigates to "/home", the Home component will be rendered */}
                <Route path="/home" element={<Home />} />

                {/* Defining the route for the login/signup page */}
                {/* The Auth component will be rendered when the user visits the "/login" path */}
                <Route path="/login" element={<Auth />} />

                {/* Defining the route for the view files page */}
                {/* The ViewFiles component will be displayed when the user navigates to "/view-files" */}
                <Route path="/view-files" element={<ViewFiles />} />

                {/* Defining the route for the profile page */}
                {/* When the user navigates to "/profile", the Profile component will be rendered */}
                <Route path="/profile" element={<Profile />} />

                {/* Defining the route for fetching JSON data */}
                {/* The FetchJsonButton component will be displayed when the user visits "/get-json" */}
                <Route path="/get-json" element={<FetchJsonButton />} />
            </Routes>
        </Router>
    );
}

// Exporting the App component so it can be used in other parts of the application
export default App;

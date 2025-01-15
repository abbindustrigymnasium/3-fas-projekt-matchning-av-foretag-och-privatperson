import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Auth";
import ViewFiles from "./ViewFiles";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/view-files" element={<ViewFiles />} />
            </Routes>
        </Router>
    );
}

export default App;

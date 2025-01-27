import React from "react"; // Import React for building components
import ReactDOM from "react-dom/client"; // Import ReactDOM to render the app to the DOM
import App from "./App"; // Import the main App component

// Create a root element where the app will be rendered
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app to the root element with strict mode enabled for highlighting potential problems in the app
root.render(
  <React.StrictMode>
    <App />  {/* The main App component */}
  </React.StrictMode>
);

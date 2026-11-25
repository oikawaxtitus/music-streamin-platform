
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// Imports the main CSS file.
import "./style.css";

// Finds the root element in index.html
// and displays the React application inside it.
ReactDOM.createRoot(
  document.getElementById("root")
).render(

  // StrictMode helps identify potential problems during development.
  <React.StrictMode>

    <App />

  </React.StrictMode>

);

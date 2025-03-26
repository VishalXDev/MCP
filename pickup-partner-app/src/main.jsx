import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/styles.css";  // ✅ Ensure styles are correctly imported

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> 
    <App />  {/* ✅ Wrap App inside <BrowserRouter> here */}
  </BrowserRouter>
);

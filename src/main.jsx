import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // ✅ Router import
import "./index.css";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Predictions from "./pages/Predictions.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />         {/* Default home: Dashboard */}
        <Route path="/predictions" element={<Predictions />} />  {/* Show Predictions page */}
        <Route path="/app" element={<App />} />            {/* If you want App test page */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
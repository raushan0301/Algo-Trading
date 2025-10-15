import React from "react";
// Remove Dashboard import for now
// import Dashboard from "./pages/Dashboard";
import Predictions from "./pages/Predictions";  // ✅ Import Predictions

function App() {
  return (
    <div>
      <Predictions />   {/* ✅ Only render Predictions page */}
    </div>
  );
}

export default App;
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import ProjectDetail from "./pages/ProjectDetail";
import SubmitProject from "./pages/SubmitProject"; // 👈 Import Submit page
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/submit" element={<SubmitProject />} /> {/* 👈 Add this */}
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </>
  );
}

export default App;

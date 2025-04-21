import { Routes, Route } from "react-router-dom";
import NavBar         from "./components/Navbar.jsx";
import Home           from "./pages/Home.jsx";
import ProjectDetail  from "./pages/ProjectDetail.jsx";
import MyTeam         from "./pages/MyTeam.jsx";
import Profile        from "./pages/Profile.jsx";
import SubmitProject  from "./pages/SubmitProject.jsx";
import Vote           from "./pages/Vote.jsx";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/projectdetails" element={<ProjectDetail />} />
        <Route path="/my-team"        element={<MyTeam />} />
        <Route path="/profile"        element={<Profile />} />
        <Route path="/submit"         element={<SubmitProject />} />  {/* ← matches NavBar */}
        <Route path="/vote"           element={<Vote />} />
      </Routes>
    </>
  );
}

// File: frontend/src/App.jsx

import { Routes, Route } from "react-router-dom";
import NavBar         from "./components/Navbar.jsx";
import Home           from "./pages/Home.jsx";
import ProjectDetail  from "./pages/ProjectDetail.jsx";
import MyTeam         from "./pages/MyTeam.jsx";
import Profile        from "./pages/Profile.jsx";
import SubmitProject  from "./pages/SubmitProject.jsx";
import Vote           from "./pages/Vote.jsx";
import Login          from "./pages/login.jsx";
import SignUp         from "./pages/SignUp.jsx";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"               element={<Home />} />
       <Route path="/signup"         element={<SignUp />} />
       <Route path="/login"          element={<Login />} />
        <Route path="/projects"       element={<ProjectDetail />} />
        <Route path="/my-team"        element={<MyTeam />} />
        <Route path="/profile"        element={<Profile />} />
        <Route path="/submit"         element={<SubmitProject />} />
        <Route path="/vote"           element={<Vote />} />
      </Routes>
    </>
  );
}

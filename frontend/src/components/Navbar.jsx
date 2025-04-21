// File: frontend/src/components/NavBar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function NavBar() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("accessToken");
  const base     = "px-4 py-2 font-medium uppercase text-center rounded";
  const active   = "text-white bg-red-600";
  const inactive = "text-gray-800 hover:text-red-600";

  const handleLogout = async () => {
    try { await axios.post("/logout"); } catch {}
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  // Always show HOME on the left
  const leftLinks = [
    { to: "/", label: "Home" }
  ];

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center p-4">
        {/* Left side */}
        <div className="flex space-x-4">
          {leftLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex flex-col space-y-2">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-medium uppercase text-gray-800 hover:text-red-600 bg-white border border-gray-300 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : "bg-red-600 text-white"}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

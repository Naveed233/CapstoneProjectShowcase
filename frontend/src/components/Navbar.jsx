import { NavLink, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function NavBar() {
  const navigate = useNavigate();
  const base     = "px-4 py-2 font-medium uppercase";
  const active   = "text-white bg-red-600 rounded";
  const inactive = "text-gray-800 hover:text-red-600";

  const handleLogout = async () => {
    await axios.post("/logout");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-100 shadow-md">
      <ul className="max-w-6xl mx-auto flex space-x-4 p-4">
        {[
          { to: "/",        label: "Home"    },
          { to: "/projects",label: "Projects"},
          { to: "/my-team", label: "My Team" },
          { to: "/profile", label: "Profile" },
          { to: "/submit",  label: "Submit"  },  // ← your submit form
          { to: "/vote",    label: "Vote"    },
        ].map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}

        <li className="ml-auto">
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium uppercase text-gray-800 hover:text-red-600"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

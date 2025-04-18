import { NavLink } from "react-router-dom";

const navItemClass = ({ isActive }) =>
  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
    isActive
      ? "bg-[#A50F26] text-white"
      : "text-white hover:bg-white hover:text-[#C8102E]"
  }`;

function Navbar() {
  return (
    <nav className="bg-[#C8102E] shadow-md p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-white">
        TSBC Python Capstone Showcase
      </div>
      <div className="flex space-x-4">
        <NavLink to="/" className={navItemClass}>
          Home
        </NavLink>
        <NavLink to="/submit" className={navItemClass}>
          Submit
        </NavLink>
        <NavLink to="/vote" className={navItemClass}>
          Vote
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;

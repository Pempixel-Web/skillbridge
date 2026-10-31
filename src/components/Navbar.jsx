import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <>
      <nav className="navbar">
        <Link to="/" onClick={closeMenu} aria-label="SkillBridge home">
          <img
            src="https://res.cloudinary.com/rclvnovx/image/upload/v1792145642/skillbridge_logo.svg"
            alt="Skillbridge Logo"
            className="logo"
          />
        </Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            {/* Takes the visitor to the "Explore Students" section on the Home page */}
            <NavLink to="/#explore" end className={linkClass} onClick={closeMenu}>
              Discover
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={linkClass} onClick={closeMenu}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/how-it-works" className={linkClass} onClick={closeMenu}>
              How it works
            </NavLink>
          </li>
          <li>
            <a href="#Join the Community">
              <button>Join the community</button>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;

import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const links = [
  {
    label: "Discover",
    path: "/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5v10a.5.5 0 0 1-.5.5H15v-7H9v7H3.5a.5.5 0 0 1-.5-.5z" />
      </svg>
    ),
  },
  {
    label: "Saved",
    path: "/saved",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v16L12 16l-7.5 5V5A1.5 1.5 0 0 1 6 3.5Z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/profile",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="7" r="3.5" />
        <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2Z" />
      </svg>
    ),
  },
];

// Guests who tap Saved / Profile are sent to log in, then brought back.
const BottomNav = () => (
  <nav className="bottom-nav" aria-label="Mobile navigation">
    {links.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        end={link.path === "/"}
        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
      >
        {link.icon}
        <span>{link.label}</span>
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;

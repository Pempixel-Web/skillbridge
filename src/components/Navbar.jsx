import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import "./Navbar.css";

function Avatar({ profile, user }) {
  const name = profile?.full_name || user?.email || "?";
  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt="" className="nav-avatar" />;
  }
  return (
    <span className="nav-avatar nav-avatar-fallback" aria-hidden="true">
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const popRef = useRef(null);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
    setPopOpen(false);
  };
  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  // Close the avatar popover when clicking outside it or pressing Escape
  useEffect(() => {
    if (!popOpen) return;
    const onClick = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setPopOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setPopOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [popOpen]);

  async function handleLogout() {
    closeMenu();
    await signOut();
    navigate("/", { replace: true });
  }

  const displayName = profile?.full_name?.split(" ")[0] || "Account";

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

          {/* ---------- Logged-out ---------- */}
          {!loading && !user && (
            <>
              <li>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  Log in
                </NavLink>
              </li>
              <li>
                <Link to="/signup" onClick={closeMenu}>
                  <button type="button">Join the community</button>
                </Link>
              </li>
            </>
          )}

          {/* ---------- Logged-in: desktop avatar menu ---------- */}
          {!loading && user && (
            <>
              <li className="nav-user-desktop" ref={popRef}>
                <button
                  type="button"
                  className="nav-user-btn"
                  onClick={() => setPopOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={popOpen}
                >
                  <Avatar profile={profile} user={user} />
                  <span>{displayName}</span>
                  <span aria-hidden="true">▾</span>
                </button>
                {popOpen && (
                  <div className="nav-popover" role="menu">
                    <Link to="/profile" role="menuitem" onClick={closeMenu}>My profile</Link>
                    <Link to="/saved" role="menuitem" onClick={closeMenu}>Saved students</Link>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                )}
              </li>

              {/* ---------- Logged-in: mobile menu items ---------- */}
              <li className="nav-user-mobile">
                <NavLink to="/profile" className={linkClass} onClick={closeMenu}>
                  My profile
                </NavLink>
              </li>
              <li className="nav-user-mobile">
                <NavLink to="/saved" className={linkClass} onClick={closeMenu}>
                  Saved students
                </NavLink>
              </li>
              <li className="nav-user-mobile">
                <button type="button" className="nav-logout" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;

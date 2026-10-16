
import "./BottomNav.css";

const BottomNav = () => {
  const currentPath = window.location.pathname;

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

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {links.map((link) => (
        <a
          key={link.path}
          href={link.path}
          className={`bottom-nav-item ${
            currentPath === link.path ? "active" : ""
          }`}
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default BottomNav;

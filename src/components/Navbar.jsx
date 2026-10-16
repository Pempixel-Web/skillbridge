// import './Navbar.css'

// function Navbar() {
//   return (
//     <header>
//       <nav>
//         <a href="#" className="logo">
//           SkillBridge
//         </a>

//         <div>
//           <a href="#">Discover</a>
//           <a href="#">About</a>
//           <a href="#">How it works</a>
//           <a href="#">
//             <button>Join the Community</button>
//           </a>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Navbar;

import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <img
          src="https://res.cloudinary.com/rclvnovx/image/upload/v1792145642/skillbridge_logo.svg"
          alt="Skillbridge Logo"
          className="logo"
        />

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          airal-expanded={menuOpen}
        >
          ☰
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <a href="#home" className="active">
              Discover
            </a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#How it works">How it works</a>
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

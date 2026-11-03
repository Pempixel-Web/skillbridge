import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <div className="footer-logo-box">S</div>
            <span className="footer-logo-text">SkillBridge</span>
          </div>
          <p className="footer-tagline">make the right connection...</p>
        </div>

        {/* Discover Column */}
        <div className="footer-col">
          <h3>Discover</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><Link to="/guidelines">Community guidelines</Link></li>
          </ul>
        </div>

        {/* Join Us Column */}
        <div className="footer-col">
          <h3>Join us</h3>
          <ul>
            <li><Link to="/signup">Create account</Link></li>
            <li><Link to="/login">Log in</Link></li>
          </ul>
        </div>

        {/* Customer Support Column */}
        <div className="footer-col">
          <h3>Customer Support</h3>
          <ul>
            <li><span>Whatapp: 08129473352</span></li>
            <li><span>Email: tech.pempixel@gmail.com</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <p>© 2026 SkillBridge. make the right connection...</p>
      </div>
    </footer>
  );
}
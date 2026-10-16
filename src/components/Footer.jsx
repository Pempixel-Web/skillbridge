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
            <li><a href="#home">Home</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#community">Community</a></li>
          </ul>
        </div>

        {/* Join Us Column */}
        <div className="footer-col">
          <h3>Join us</h3>
          <ul>
            <li><a href="#volunteer">volunteer</a></li>
            <li><a href="#career">Career</a></li>
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
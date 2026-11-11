import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  banner,
  children,
  footer,
}) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand" aria-label="SkillBridge home">
          <span className="auth-brand-box">S</span>
          <span>SkillBridge</span>
        </Link>
        <h1>{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {banner && <div className="auth-banner">{banner}</div>}
        {children}
        {footer && <p className="auth-footer">{footer}</p>}
      </div>
    </main>
  );
}
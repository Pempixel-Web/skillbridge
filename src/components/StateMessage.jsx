// Reusable message for loading / error / empty states.
export default function StateMessage({ title, children, role }) {
  return (
    <div
      role={role}
      style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}
    >
      {title && <p style={{ fontSize: "18px", fontWeight: "600" }}>{title}</p>}
      <p style={{ fontSize: "14px", marginTop: "8px" }}>{children}</p>
    </div>
  );
}

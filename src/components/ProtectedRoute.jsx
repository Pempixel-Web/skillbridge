import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { getPending, setPending } from "../lib/pendingAction.js";

// Remember where the visitor wanted to go, without losing a pending "save" action.
const rememberDestination = (next) =>
  setPending({ ...(getPending() || {}), next });

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader-spinner" aria-hidden="true" />
      <p>Loading…</p>
    </div>
  );
}

// Must be logged in. Guests are sent to /login and returned here afterwards.
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) {
    rememberDestination(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Must be logged in AND have finished onboarding.
export function RequireProfile({ children }) {
  const { user, loading, isComplete } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) {
    rememberDestination(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }
  if (!isComplete) {
    rememberDestination(location.pathname + location.search);
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

// Login / signup pages: already-logged-in students don't need them.
export function GuestOnly({ children }) {
  const { user, loading, isComplete } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={isComplete ? "/" : "/onboarding"} replace />;
  return children;
}

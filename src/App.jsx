import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GuestOnly, RequireAuth, RequireProfile } from "./components/ProtectedRoute.jsx";
import { isSupabaseConfigured } from "./lib/supabaseClient.js";

import Directory from "./pages/Directory";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import StudentProfile from "./pages/StudentProfile";
import Guidelines from "./pages/Guidelines";

// Scrolls to the right place whenever the route changes:
//  - "/#explore" -> smooth scroll to the Explore Students section
//  - any other page -> back to the top
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash && !hash.includes("=")) {
      const id = decodeURIComponent(hash.slice(1));
      const frame = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash, key]);

  return null;
}

// Friendly screen shown until the .env file has been filled in.
function SetupNeeded() {
  return (
    <main style={{ maxWidth: 560, margin: "80px auto", padding: "0 20px", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ color: "#0b1e43" }}>Almost there: connect Supabase</h1>
      <p style={{ color: "#475569", lineHeight: 1.7 }}>
        Open the <code>.env</code> file in your project root and paste your Supabase{" "}
        <strong>Project URL</strong> and <strong>anon public key</strong> (Supabase →
        Project Settings → API). Then stop and restart <code>npm run dev</code>.
      </p>
      <p style={{ color: "#475569" }}>The full steps are in <code>SETUP_GUIDE.md</code>.</p>
    </main>
  );
}

function App() {
  if (!isSupabaseConfigured) return <SetupNeeded />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollManager />
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Directory />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/guidelines" element={<Guidelines />} />

          {/* Guests only */}
          <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/verify-email" element={<GuestOnly><VerifyEmail /></GuestOnly>} />
          <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Logged in, profile not finished yet */}
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

          {/* Logged in + profile finished */}
          <Route path="/profile" element={<RequireProfile><Profile /></RequireProfile>} />
          <Route path="/saved" element={<RequireProfile><Saved /></RequireProfile>} />
          <Route path="/students/:id" element={<RequireProfile><StudentProfile /></RequireProfile>} />

          {/* Anything unknown falls back to the home page */}
          <Route path="*" element={<Directory />} />
        </Routes>
        <BottomNav />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

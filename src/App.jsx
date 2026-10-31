import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Directory from "./pages/Directory";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

// Scrolls to the right place whenever the route changes:
//  - "/#explore" -> smooth scroll to the Explore Students section
//  - any other page -> back to the top
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Wait one frame so the page has rendered before we look for the element
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

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        {/* Anything unknown falls back to the home page */}
        <Route path="*" element={<Directory />} />
      </Routes>
      <BottomNav />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import SidebarContext from "./SidebarContext";

// Create and export the context

export const SidebarProvider = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuOpenRef = useRef(mobileMenuOpen);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      if (mobileView) setSidebarExpanded(false);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  // Close mobile menu only when location.pathname actually changes
  useEffect(() => {
    if (mobileMenuOpenRef.current) { // Check ref to see if menu was open
      setMobileMenuOpen(false);
    }
  }, [location.pathname]); // Only depend on location.pathname

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      toggleMobileMenu();
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  const value = {
    sidebarExpanded,
    setSidebarExpanded,
    isMobile,
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleMobileMenu,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

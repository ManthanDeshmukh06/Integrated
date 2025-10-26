"use client";
import { useState, useEffect } from "react";

export const useDoctorAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const doctorLoggedIn = localStorage.getItem("doctorLoggedIn");
        const userData = localStorage.getItem("hmsUser");
        
        if (doctorLoggedIn === "true" && userData) {
          const user = JSON.parse(userData);
          if (user.role === "doctor") {
            setUser(user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("doctorLoggedIn");
    localStorage.removeItem("hmsUser");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return { user, loading, isAuthenticated, logout };
};
// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Retrieve token and student info from localStorage on initial load
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("student")) || null;
    } catch {
      return null;
    }
  });

    // Ensure token is restored when the app loads
    useEffect(() => {
      if (!token && localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }, []);


  // Update localStorage whenever token or student changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (student) {
      localStorage.setItem("student", JSON.stringify(student));
    } else {
      localStorage.removeItem("student");
    }
  }, [token, student]);

  // Function to handle login and update state
  const login = (newToken, studentData) => {
    setToken(newToken);
    setStudent(studentData);
  };

  // Function to handle logout and clear state
  const logout = () => {
    setToken(null);
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ token, student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);

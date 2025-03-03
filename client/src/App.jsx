// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EnrollStudentInCourse from "./components/EnrollStudentInCourse";
import UpdateCourse from "./components/UpdateCourse";
import ListStudents from "./components/ListStudents";
import ListCourses from "./components/ListCourses";
import Footer from "./components/Footer"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const { token } = useAuth();
  const savedToken = localStorage.getItem("token");
  console.log("Auth Token:", token);
  console.log("LocalStorage Token:", savedToken);
  
  return (
    <Router>
      <Routes>
        {/* Default route is Register */}
        <Route path="/" element={<Navigate to="/register" />} />
        
        {/* Register Page */}
        <Route path="/register" element={<Register />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Require Token) */}
        <Route path="/dashboard" element={token || savedToken ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/enroll" element={token || savedToken ? <EnrollStudentInCourse /> : <Navigate to="/login" />} />
        <Route path="/update-course/:courseCode" element={token || savedToken ? <UpdateCourse /> : <Navigate to="/login" />} />
        <Route path="/list-students" element={token || savedToken ? <ListStudents /> : <Navigate to="/login" />} />
        <Route path="/list-courses" element={token || savedToken ? <ListCourses /> : <Navigate to="/login" />} />

        {/* Redirect unknown routes to Register */}
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
      {/* Footer - Always Visible */}
      <Footer />
    </Router>
  );
}

export default App;

// src/components/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { graphqlRequest } from "../api/api.js";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "../styles/Login.css"

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ studentNumber: "", password: "" });
  const [error, setError] = useState("");  // Initialize the error state
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset the error message when the form is submitted
    setSuccessMessage("");

    if (!formData.studentNumber || !formData.password) {
      setError("Please enter both student number and password.");
      return;
    }

    const query = `
      mutation Login($studentNumber: String!, $password: String!) {
        login(studentNumber: $studentNumber, password: $password) {
          token
          student {
            id
            studentNumber
            firstName
            lastName
            email
          }
        }
      }
    `;

    try {
      console.log("📤 Sending login request with:", formData);

      const data = await graphqlRequest(query, formData);

      if (!data || !data.login || !data.login.token || !data.login.student) {
        throw new Error("Invalid login response from server.");
      }

      const { token, student } = data.login;
      console.log("✅ Login Success:", { token, student });

      // Save data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("student", JSON.stringify(student));

      // Update context
      login(token, student);

      setSuccessMessage("Login successful! Redirecting...");

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      //alert("Invalid credentials. Please try again.");
      setError("Invalid credentials. Please try again.");

    }
  };

  return (
    <Container className="login-container">
      <h2 className="login-header">Student Login</h2>
      
      {/* Display success or error messages */}
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Group controlId="formStudentNumber">
          <Form.Control
            type="text"
            name="studentNumber"
            placeholder="Student Number"
            value={formData.studentNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="login-btn">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
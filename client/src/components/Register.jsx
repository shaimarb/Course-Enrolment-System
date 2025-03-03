// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { graphqlRequest } from "../api/api";
import "../styles/Register.css";


const REGISTER_STUDENT = `
  mutation RegisterStudent(
    $studentNumber: String!,
    $firstName: String!,
    $lastName: String!,
    $address: String!,
    $city: String!,
    $phoneNumber: String!,
    $email: String!,
    $program: String!,
    $password: String!
  ) {
    registerStudent(
      studentNumber: $studentNumber,
      firstName: $firstName,
      lastName: $lastName,
      address: $address,
      city: $city,
      phoneNumber: $phoneNumber,
      email: $email,
      program: $program,
      password: $password
    ) {
      token
      student {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    program: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    /*try {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: REGISTER_STUDENT,
          variables: formData,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0].message);
        return;
      }

      setSuccessMessage("Registration successful! You can now log in.");
    // After successful registration, navigate to the login page
    setTimeout(() => {
      navigate("/login"); // Navigates to login page
    }, 1000); // 1-second delay before navigating
  } catch (error) {
    setError("Something went wrong. Please try again.");
  }
};*/
try {
  // Use graphqlRequest instead of manual fetch
  const data = await graphqlRequest(REGISTER_STUDENT, formData);

  if (!data?.registerStudent) {
    throw new Error("Registration failed. Please try again.");
  }

  setSuccessMessage("Registration successful! You can now log in.");
  
  // Redirect to login page after successful registration
  setTimeout(() => navigate("/login"), 1000);
  
} catch (error) {
  setError(error.message || "Something went wrong. Please try again.");
}
};

  return (
    <Container className="register-container">
      <h2 className="register-header">Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="register-form">
        <Row>
          <Col md={6}>
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

            <Form.Group controlId="formLastName">
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCity">
              <Form.Control
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
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
          </Col>

          <Col md={6}>
            <Form.Group controlId="formFirstName">
              <Form.Control
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Control
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPhoneNumber">
              <Form.Control
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProgram">
              <Form.Control
                type="text"
                name="program"
                placeholder="Program"
                value={formData.program}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="register-btn">
              Register
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Register;
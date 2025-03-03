//src/components/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { graphqlRequest } from "../api/api";
import { useNavigate } from "react-router-dom";
import { ListGroup, Button, Alert, Spinner } from "react-bootstrap";
import "../styles/Dashboard.css"

const Dashboard = () => {
  const { student, token, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  console.log("Student data:", student); // Debugging step

  useEffect(() => {
    if (!token || !student) {
      console.log("No session found, redirecting to login...");
      navigate("/login"); // Redirect to login if no session
      return;
    }

    console.log("Student in Dashboard:", student);
    console.log("Token:", token);

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await graphqlRequest(
          `query MyCourses { myCourses { id courseCode courseName section semester } }`,
          {},
          token // Use token from context
        );
        setCourses(data?.myCourses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [student, token, navigate]);

  // Ensure student data is fully loaded before rendering
  if (!student) {
    return <p>Loading student data...</p>;
  }

  const handleDropCourse = async (courseId) => {
    try {
      await graphqlRequest(
        `mutation DropCourse($studentId: ID!, $courseId: ID!) {
          dropCourse(studentId: $studentId, courseId: $courseId)
        }`,
        { studentId: student.id, courseId },
        token
      );
      
      // Set success message and hide it after 1 second
      setSuccessMessage("Course successfully dropped.");
      setTimeout(() => {
        setSuccessMessage(""); // Clear the message after 1 second
      }, 1000);

      // Update courses after dropping
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== courseId)
      );
    } catch (error) {
      console.error("Error dropping course:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="welcome-header">Welcome, {student.firstName} {student.lastName}</h2>
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}

      <h3>Your Courses</h3>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : courses.length > 0 ? (
        <ListGroup>
          {courses.map((course) => (
            <ListGroup.Item key={course.id} className="d-flex justify-content-between align-items-center">
            <div>
              {course.courseName} - {course.section} ({course.semester})
            </div>
            <div className="btn-container">
              <Button
                variant="warning"
                size="sm"
                onClick={() => navigate(`/update-course/${course.courseCode}`)}
                style={{
                  backgroundColor: '#b8a0d0',
                  borderColor: '#b8a0d0',
                }}
                className="me-2"
              >
                Update
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => handleDropCourse(course.id)}
              >
                Drop
              </Button>
            </div>
          </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Not enrolled in any courses yet.</p>
      )}

      <h3>Actions</h3>
      <ListGroup>
        <ListGroup.Item action onClick={() => navigate("/enroll")}>
          Enroll in a Course
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/list-courses")}>
          View All Courses
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => navigate("/list-students")}>
          View All Students
        </ListGroup.Item>
        <ListGroup.Item action onClick={logout} style={{ color: "red" }}>
          Logout
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default Dashboard;
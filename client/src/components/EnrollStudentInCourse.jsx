//src/components/EnrollStudentInCourse.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { graphqlRequest } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import "../styles/EnrollStudentInCourse.css"

const GET_COURSES_QUERY = `
  query {
    getCourses {
      id
      courseCode
      courseName
      section
      semester
    }
  }
`;

const ENROLL_STUDENT_MUTATION = `
  mutation EnrollStudent($studentId: ID!, $courseId: ID!) {
    enrollStudentInCourse(studentId: $studentId, courseId: $courseId) {
      id
      courses {
        courseCode
        courseName
        section
        semester
      }
    }
  }
`;

const EnrollStudentInCourse = () => {
  const { student, token } = useAuth();  // Use student & token from AuthContext
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!student) {
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }

    const fetchCourses = async () => {
      setLoading(true); // Start loading before making API request
      try {
        const data = await graphqlRequest(GET_COURSES_QUERY, {}, token);
        setCourses(data?.getCourses || []); // Store retrieved courses or empty array if none found
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to fetch courses. Please try again."); // Set error message on failure
      } finally {
        setLoading(false); // Stop loading after API call completes
      }
    };


    fetchCourses();
  }, [student, token, navigate]);

  const handleEnroll = async () => {
    if (!selectedCourse) {
      setError("Please select a course."); // Prevent enrollment if no course is selected
      return;
    }

    setError(null);
    setSuccess(null); // Clear previous messages before new request

    try {
      const [courseId, section] = selectedCourse.split("|"); // Extract courseId & section from selection

      const response = await graphqlRequest(
        ENROLL_STUDENT_MUTATION,
        { studentId: student.id, courseId }, // Send student ID and selected course ID to API
        token
      );

      setSuccess("Successfully enrolled in the course!");

  
  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     });
  //   } catch (error) {
  //     console.error("Enrollment error:", error);
  //     setError("Failed to enroll in course.");
  //   }
  // };

  setTimeout(() => {
    navigate("/dashboard");
  });
} catch (error) {
  console.error("Enrollment error:", error);

  // Handle different error cases
  if (error.message.includes("Network request failed")) {
    setError("You are already enrolled in another section for this course. Please select a different course.");
  }
  // Handle specific backend errors, such as already enrolled
  else if (error.message.includes("already enrolled")) {
    setError("You are already enrolled in a course with this code. Please select a different section or course.");
  }
  else {
    setError("Failed to enroll in the course. Please try again later.");
  }
}
};

  return (
    <div className="enroll-course-container"> 
      <h2 className="enroll-course-header">Enroll in a Course</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <Form className="enroll-course-form">
          <Form.Group>
            <Form.Label>Select a Course</Form.Label>
            <Form.Control
              as="select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="form-select"
            >
              <option value="">-- Select a Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={`${course.id}|${course.section}`}>
                  {course.courseCode} - {course.courseName} (Section {course.section}, {course.semester})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button onClick={handleEnroll} className="btn-enroll mt-3">Enroll</Button>
        </Form>
      )}
    </div>
  );
};

export default EnrollStudentInCourse;

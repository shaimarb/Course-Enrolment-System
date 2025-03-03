//src/components/UpdateCourse.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { graphqlRequest } from "../api/api";
import { Form, Button, Alert } from "react-bootstrap";
import "../styles/UpdateCourse.css";

const UpdateCourse = () => {
  const { courseCode } = useParams(); // Get courseCode from URL
  const { student, token } = useAuth();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!student) {
      navigate("/login");
      return;
    }

    const fetchSections = async () => {
      setLoading(true);
      try {
        // Use the correct GraphQL query for fetching course sections
        const data = await graphqlRequest(
          `query getCourseSections($courseCode: String!) {
            getCourseSections(courseCode: $courseCode) {
              courseCode
              courseName
              section
            }
          }`,
          { courseCode },
          token
        );

        // Update sections state with the response
        setSections(data?.getCourseSections || []);
      } catch (error) {
        console.error("Error fetching sections:", error);
        setError("Failed to load sections.");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [student, token, courseCode, navigate]);

  const handleUpdate = async () => {
    if (!selectedSection) {
      setError("Please select a new section.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      // Call the updateCourse mutation to update the student's section
      await graphqlRequest(
        `mutation updateCourse($studentId: ID!, $courseCode: String!, $newSection: String!) {
          updateCourse(studentId: $studentId, courseCode: $courseCode, newSection: $newSection) {
            id
            courses {
              courseCode
              section
            }
          }
        }`,
        { studentId: student.id, courseCode, newSection: selectedSection },
        token
      );

      setSuccess("Course section updated successfully!");
      setTimeout(() => navigate("/dashboard"));
    } catch (error) {
      console.error("Error updating course:", error);
      setError("You're already enrolled in this section.");
    }
  };

  return (
    <div className="update-course-container">
      <h2 className="update-course-header">Update Course Section for {courseCode}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <p>Loading available sections...</p>
      ) : (
        <Form className="update-course-form">
          <Form.Group>
            <Form.Label>Select a New Section</Form.Label>
            <Form.Control
              as="select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="form-control" 
            >
              <option value="">-- Select a Section --</option>
              {sections.map((section) => (
                <option key={section.section} value={section.section}>
                  Section {section.section}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button onClick={handleUpdate}  className="update-btn mt-3">Update Section</Button>
        </Form>
      )}
    </div>
  );
};

export default UpdateCourse;

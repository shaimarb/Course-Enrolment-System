//src/components/ListStudents.jsx

import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../api/api";
import { ListGroup, Table } from "react-bootstrap";
import "../styles/View.css";

const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true); // Indicate loading before making the request
        const data = await graphqlRequest(
          `query GetStudents { getStudents { id studentNumber firstName lastName courses { courseCode courseName section } } }`,
          {}
        );
        setStudents(data?.getStudents || []); // Store retrieved students or empty array if none found
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    fetchStudents(); // Fetch students when component mounts
  }, []);

  if (loading) {
    return <p>Loading students...</p>; // Show loading message while fetching data
  }

  return (
    <div className="view-container">
      <h2 className="view-header">All Students</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Student Name</th>
            <th>Courses Enrolled</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.studentNumber}</td>
              <td>{student.firstName} {student.lastName}</td>
              <td>
                {student.courses.length > 0 ? (
                  student.courses.map((course) => (
                    <div key={course.courseCode} className="list-item-text">
                      {course.courseCode} - {course.courseName} - Section {course.section}
                      </div>
                  ))
                ) : (
                  <p>No courses enrolled</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListStudents;

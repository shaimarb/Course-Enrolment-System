//src/components/ListCourses.jsx

import React, { useEffect, useState } from "react";
import { graphqlRequest } from "../api/api";
import { ListGroup, Table } from "react-bootstrap";
import "../styles/View.css";

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true); // Set loading to true before making the request
        const data = await graphqlRequest(
          `query GetCourses { getCourses { id courseCode courseName section students { id firstName lastName } } }`,
          {}
        );
        setCourses(data?.getCourses || []); // Store retrieved courses or empty array if none found
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    fetchCourses(); // Fetch courses when component mounts
  }, []);

  if (loading) {
    return <p>Loading courses...</p>; // Show loading message while fetching data
  }

  return (
    <div className="view-container">
      <h2 className="view-header">All Courses</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Section</th>
            <th>Students Enrolled</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td>{course.section}</td>
              <td>
                {course.students.length > 0 ? (
                  course.students.map((student) => (
                    <div key={student.id} className="list-item-text">
                      {student.firstName} {student.lastName}
                    </div>
                  ))
                ) : (
                  <p>No students enrolled</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListCourses;

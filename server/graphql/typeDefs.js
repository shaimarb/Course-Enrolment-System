// server/graphql/typeDefs.js
const gql = require('graphql-tag'); 

const typeDefs = gql`
  type Student {
    id: ID!
    studentNumber: String!
    firstName: String!
    lastName: String!
    address: String!
    city: String!
    phoneNumber: String!
    email: String!
    program: String!
    courses: [Course]
  }

  type Course {
    id: ID!
    courseCode: String!
    courseName: String!
    section: String!
    semester: String!
    students: [Student]
  }

  type AuthData {
    token: String!
    student: Student!
  }

  type Query {
    getStudents: [Student]
    getCourses: [Course]
    getStudent(id: ID!): Student
    getCourse(id: ID!): Course
    myCourses: [Course]
    getCourseSections(courseCode: String!): [Course]

  }

  type Mutation {
    registerStudent(
      studentNumber: String!, 
      firstName: String!, 
      lastName: String!, 
      address: String!, 
      city: String!, 
      phoneNumber: String!, 
      email: String!, 
      program: String!, 
      password: String!
    ): AuthData

    login(
      studentNumber: String!, 
      password: String!
    ): AuthData

    addCourse(courseCode: String!, courseName: String!, section: String, semester: String): Course
    enrollStudentInCourse(studentId: ID!, courseId: ID!): Student
    updateCourse(studentId: ID!, courseCode: String!, newSection: String!): Student
    dropCourse(studentId: ID!, courseId: ID!): String
  }
`;

module.exports = typeDefs;

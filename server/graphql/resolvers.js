// server/graphql/resolvers.js


const { GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Course = require("../models/Course");

const resolvers = {
  Query: {
    getStudents: async () => await Student.find().populate("courses"),
    getCourses: async () => await Course.find().populate("students"),
    getStudent: async (_, { id }) => await Student.findById(id).populate("courses"),
    getCourse: async (_, { id }) => await Course.findById(id).populate("students"),

    myCourses: async (_, __, { user }) => {
      if (!user)
        throw new GraphQLError("You must be logged in to view your courses", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      const student = await Student.findById(user.id).populate("courses");
      if (!student) throw new Error("Student not found");

      return student.courses;
    },

    // Resolver for getCourseSections query
    getCourseSections: async (_, { courseCode }) => {
      try {
        // Find all sections for the given courseCode
        const courses = await Course.find({ courseCode }).select('courseCode courseName section');
        return courses;
      } catch (error) {
        console.error('Error fetching course sections:', error);
        throw new Error('Failed to fetch course sections');
      }
    },
  },

  Mutation: {
    registerStudent: async (_, args) => {
      const { studentNumber, password, firstName, lastName, address, city, phoneNumber, email, program } = args;

      // Check if a student with the same student number already exists
      const existingStudent = await Student.findOne({ studentNumber });
      if (existingStudent) throw new Error("Student with this student number already exists.");

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new student instance
      const student = new Student({
        studentNumber,
        password: hashedPassword,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        email,
        program,
      });

      // Save the student to the database
      const savedStudent = await student.save();
      // Generate a JWT token for authentication
      const token = jwt.sign({ id: savedStudent.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      // Return the token and the newly registered student
      return { token, student: savedStudent };
    },

    login: async (_, { studentNumber, password }) => {
       // Find the student by student number
      const student = await Student.findOne({ studentNumber });
      if (!student) throw new Error("Student not found");

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) throw new Error("Invalid credentials");
      // Generate a JWT token for authentication
      const token = jwt.sign({ id: student.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      // Return the token and the authenticated student
      return { token, student };
    },

    addCourse: async (_, { courseCode, courseName, section, semester }, { user }) => {
        if (!user)
          throw new GraphQLError("You must be logged in to add a course", {
            extensions: { code: "UNAUTHENTICATED" },
          });
      
        const existingCourse = await Course.findOne({ courseCode });
        if (existingCourse) throw new Error("Course with this code already exists.");
      
        const course = new Course({
          courseCode,
          courseName,
          section,
          semester,
        });
      
        return await course.save();
      },
      

    // working part!!!!!
    
    /*enrollStudentInCourse: async (_, { studentId, courseId, section }, { user }) => {
      if (!user)
        throw new GraphQLError("You must be logged in to enroll in a course", {
          extensions: { code: "UNAUTHENTICATED" },
        });
    
      const student = await Student.findById(studentId);
      if (!student) throw new Error("Student not found");
    
      const course = await Course.findOne({ _id: courseId, section: section });
      if (!course) throw new Error("Course section not found");
    
      
      // Ensure student is not already enrolled in this specific course section
      const isAlreadyEnrolled = student.courses.some(
        (c) => c.toString() === courseId && c.section === section
      );
    
      if (!isAlreadyEnrolled) {
        student.courses.push(courseId);
        await student.save();
    
        if (!course.students.includes(studentId)) {
          course.students.push(studentId);
          await course.save();
        }
      }
    
      return await Student.findById(studentId).populate("courses");
    },
    */

    enrollStudentInCourse: async (_, { studentId, courseId }, { user }) => {
      if (!user) {
        throw new GraphQLError("You must be logged in to enroll in a course", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
    
      const student = await Student.findById(studentId).populate('courses');
      if (!student) throw new Error("Student not found");
    
      // Fetch the course by courseId
      const course = await Course.findById(courseId);
      if (!course) throw new Error("Course not found");
    
      const { courseCode, courseName, section } = course;
    
      // Ensure student is not already enrolled in a course with the same courseCode
      const isAlreadyEnrolledInCourse = student.courses.some(
        (enrolledCourse) => enrolledCourse.courseCode === courseCode
      );
    
      if (isAlreadyEnrolledInCourse) {
        throw new Error(`Student is already enrolled in ${courseCode} - ${courseName} - ${section}`);
      }
    
      // Add the courseId to the student's courses array
      student.courses.push(courseId);
      await student.save();
    
      // Add the studentId to the course's students array if not already added
      if (!course.students.includes(studentId)) {
        course.students.push(studentId);
        await course.save();
      }
    
      // Return the updated student with populated courses
      return await Student.findById(studentId).populate("courses");
    },
    
  
    updateCourse: async (_, { studentId, courseCode, newSection }, { user }) => {
      if (!user)
        throw new GraphQLError("You must be logged in to update a course section", {
          extensions: { code: "UNAUTHENTICATED" },
        });
    
      // Find the student and populate their courses
      const student = await Student.findById(studentId).populate("courses");
      if (!student) throw new Error("Student not found");
    
      // Find the student's current course by courseCode
      const currentCourse = student.courses.find(
        (course) => course.courseCode === courseCode
      );
    
      if (!currentCourse)
        throw new Error("Student is not enrolled in this course");
    
      // Ensure they are not already in the requested section
      if (currentCourse.section === newSection) {
        throw new Error("Student is already in this section");
      }
    
      // Find the new section for this course
      const newCourseSection = await Course.findOne({
        courseCode,
        section: newSection,
      });
    
      if (!newCourseSection)
        throw new Error("The requested section does not exist");
    
      // Remove student from old section
      await Course.findByIdAndUpdate(currentCourse._id, {
        $pull: { students: studentId },
      });
    
      // Add student to new section
      await Course.findByIdAndUpdate(newCourseSection._id, {
        $addToSet: { students: studentId },
      });
    
      // Update student's courses array
      student.courses = student.courses.filter(
        (course) => course.courseCode !== courseCode
      );
      student.courses.push(newCourseSection._id);
      await student.save();
    
      return student.populate("courses");
    },
    
    
    dropCourse: async (_, { studentId, courseId }, { user }) => {
      if (!user)
        throw new GraphQLError("You must be logged in to drop a course", {
          extensions: { code: "UNAUTHENTICATED" },
        });
    
      // Find student
      const student = await Student.findById(studentId);
      if (!student) throw new Error("Student not found");
    
      // Find the course
      const course = await Course.findById(courseId);
      if (!course) throw new Error("Course not found");
    
      // Check if the student is actually enrolled
      if (!student.courses.includes(courseId)) {
        throw new Error("Student is not enrolled in this course");
      }
    
      // Remove course from student's enrolled courses
      student.courses = student.courses.filter(
        (c) => c.toString() !== courseId.toString()
      );
      await student.save();
    
      // Remove student from the course's students list
      await Course.findByIdAndUpdate(courseId, {
        $pull: { students: studentId },
      });
    
      return "Student successfully dropped from the course";
    },
    
  },
};

module.exports = resolvers;

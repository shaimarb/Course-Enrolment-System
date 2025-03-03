// server/seedCourses.js

const mongoose = require("./config/mongoose");
const Course = require("./models/Course");

const seedCourses = async () => {
  try {
    const courses = [
      { courseCode: "COMP308", courseName: "Emerging Technologies", section: "A", semester: "Winter 2025" },
      { courseCode: "COMP308", courseName: "Emerging Technologies", section: "B", semester: "Winter 2025" },
      { courseCode: "COMP308", courseName: "Emerging Technologies", section: "C", semester: "Winter 2025" },
      { courseCode: "COMP377", courseName: "AI for Software Developers", section: "A", semester: "Winter 2025" },
      { courseCode: "COMP377", courseName: "AI for Software Developers", section: "B", semester: "Winter 2025" },
      { courseCode: "COMP303", courseName: "Enterprise Application Development", section: "A", semester: "Winter 2025" },
      { courseCode: "COMP303", courseName: "Enterprise Application Development", section: "B", semester: "Winter 2025" },
      { courseCode: "COMP303", courseName: "Enterprise Application Development", section: "C", semester: "Winter 2025" },
    ];

    // Check if courses already exist based on `courseCode` and `section`
    for (const course of courses) {
      const existingCourse = await Course.findOne({
        courseCode: course.courseCode,
        section: course.section, // Ensure sections are checked separately
      });

      if (!existingCourse) {
        await Course.create(course);
        console.log(`✅ Added course: ${course.courseName} - Section ${course.section}`);
      } else {
        console.log(`⚠️ Course already exists: ${course.courseName} - Section ${course.section}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
  } 
};

module.exports = seedCourses;

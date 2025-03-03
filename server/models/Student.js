// server/models/Student.js


const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: String,
  city: String,
  phoneNumber: String,
  email: { type: String, required: true, unique: true },
  program: { type: String, required: true },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = mongoose.model("Student", StudentSchema);




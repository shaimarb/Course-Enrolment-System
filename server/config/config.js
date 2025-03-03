// server/config/config.js


require("dotenv").config();

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env file");
}

module.exports = {
  PORT: process.env.PORT || 4000,
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/student-course-db",
  JWT_SECRET: process.env.JWT_SECRET, // Only from .env, no fallback
};
// server/config/mongoose.js

const mongoose = require("mongoose");
const config = require("./config");

mongoose
  .connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;


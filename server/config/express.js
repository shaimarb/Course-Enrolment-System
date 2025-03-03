// server/config/express.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("express.json");

module.exports = (app) => {
  app.use(cors());
  app.use(bodyParser());
  console.log("✅ Express middleware initialized");
};

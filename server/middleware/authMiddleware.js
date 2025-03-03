// server/middleware/authMiddleware.js


const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the authorization header
  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" }); // Return 401 if no token is provided
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" }); // Return 403 if token is invalid or expired
    }
    req.user = user; // Attach the decoded user data to the request object
    next(); // Move to the next middleware or route handler
  });
};

module.exports = { authenticateToken };

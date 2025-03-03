//server.js

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const { PORT } = require("./config/config");
require("./config/mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const seedCourses = require("./seedCourses");

dotenv.config();

const app = express();

// Middleware to extract JWT from headers
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.warn("⚠️ Invalid token:", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
  }
  next();
};


// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server and apply middleware
async function startServer() {
  await seedCourses(); // Seed database before starting

  await server.start();

  app.use(cors()); // Enable CORS for frontend requests
  app.use(express.json());
  app.use(authMiddleware); // Apply authentication middleware

  // GraphQL Endpoint
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: ({ req }) => ({ user: req.user }), // Pass authenticated user to resolvers
    })
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();

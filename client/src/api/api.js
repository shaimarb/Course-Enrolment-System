// src/api/api.js
import axios from "axios";

// Base URL for the GraphQL API
const API_URL = "http://localhost:4000/graphql";

/**
 * Function to send GraphQL queries/mutations.
 * Uses Axios to make a POST request to the GraphQL API.
 *
 * @param {string} query - The GraphQL query or mutation string.
 * @param {Object} [variables={}] - Optional variables for the query/mutation.
 * @param {string|null} [token=null] - Optional authentication token for protected routes.
 * @returns {Promise<Object>} - Returns the response data from the GraphQL API.
 * @throws {Error} - Throws an error if the request fails or GraphQL returns an error.
 */

export const graphqlRequest = async (query, variables = {}, token = null) => {
  try {
    console.log("📡 Sending GraphQL Request:", { query, variables }); // Debugging

    // Make the HTTP request using Axios
    const response = await axios.post(
      API_URL,
      { query, variables }, // GraphQL payload
      {
        headers: {
          "Content-Type": "application/json", // Ensure request is sent as JSON
          ...(token && { Authorization: `Bearer ${token}` }), // Include authorization token if available
        },
      }
    );

    console.log("✅ GraphQL Response:", response.data); // Debugging

    // Check if GraphQL returned errors
    if (response.data.errors) {
      console.error("❌ GraphQL Errors:", response.data.errors);
      throw new Error(response.data.errors[0]?.message || "GraphQL request failed");
    }

    return response.data.data;  // Return the actual data object from the response
  } catch (error) {
    console.error("❌ Fetch Error:", error.response?.data || error.message);

    // If the error response contains GraphQL errors, log them
    if (error.response?.data?.errors) {
      console.error("❌ GraphQL Error Details:", JSON.stringify(error.response.data.errors, null, 2));
    }

    throw new Error(error.response?.data?.errors?.[0]?.message || "Network request failed");
  }
};

/**
 * app.ts defines the root entry of the Express application.
 * It sets up middleware, routes, and error handling for user-related, ticket-related, comment-related,
 * and admin-related functionality.
 *
 * @author Toyeeb Atunde
 */

// Import necessary modules and middleware from external libraries and your application
import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import {
  errorHandler, // Custom error handler middleware
  NotFoundError, // Custom error class for handling 404 (Not Found) errors
  currentUser, // Middleware to extract and set the current user from JWT
} from "../common";

import {
  userRoutes, // Routes for user-related functionality
} from "../auth-srv/routes";

import {
  ticketRoutes, // Routes for ticket-related functionality
} from "../ticket-srv/routes";

import {
  commentRoutes, // Routes for comment-related functionality
} from "../comment-srv/routes";

import {
  adminRoutes, // Routes for admin-related functionality
} from "../admin-srv/routes";
import { swaggerRoutes } from "./swagger";

// Create an instance of the Express application
const app = express();

// Define the base URL for API endpoints
const Base_Url = "/api/v1";

// Enable trust for proxy headers to ensure correct handling of client IP addresses
app.set("trust proxy", true);

// Use the body-parser middleware to parse incoming JSON requests
app.use(json());

// Use the currentUser middleware to extract and set the current user based on the JWT
app.use(currentUser);

// Use the user router for all user-related routes
app.use(`${Base_Url}/user`, userRoutes);

// Use the ticket router for all ticket-related routes
app.use(`${Base_Url}/ticket`, ticketRoutes);

// Use the comment router for all comment-related routes
app.use(`${Base_Url}/comment`, commentRoutes);

// Use the admin router for all admin-related routes
app.use(`${Base_Url}/admin`, adminRoutes);

// Swagger documentation route
app.use(`${Base_Url}/swagger`, swaggerRoutes);

// Capture all unmatched routes and throw a NotFoundError
app.all("*", () => {
  throw new NotFoundError();
});

// Use the custom errorHandler middleware to handle errors and send appropriate responses
app.use(errorHandler);

// Export the Express application for use in other parts of the application
export { app };

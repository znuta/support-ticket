/**
 * index.ts defines the root entry of the app.
 * @author Toyeeb Atunde
 */

// Import necessary modules and types from external libraries and your application
import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./src/app";
import { DatabaseError } from "./src/common";

// Load environment variables from a .env file
dotenv.config();

// Define the port on which the server will listen, defaulting to 8000 if not provided in the environment
const port = process.env.PORT || 8000;

// Define an asynchronous function to start the server
const start = async () => {
  // Check if the JWT_KEY environment variable is defined, throw an error if not
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  // Check if the DATABASE_URL environment variable (MongoDB connection string) is defined, throw an error if not
  if (!process.env.DATABASE_URL) {
    throw new Error("MONGO_URI must be defined");
  }

  // Connect to MongoDB using Mongoose, with additional options like retryWrites
  await mongoose
    .connect(process.env.DATABASE_URL, {
      retryWrites: true,
    })
    .then(async () => {
      // If MongoDB connection is successful, log a message and proceed with additional setup
      console.log("Connected to the MongoDB instance");

      // Try executing additional setup logic from the "setup" module
      try {
        await require("./src/app/setup");
      } catch (error) {
        // Log any errors that occur during setup
        console.error("Error during server startup:", error);
      }
    })
    .catch((err) => {
      // If MongoDB connection fails, log the error and throw a custom DatabaseError
      console.log(err);
      throw new DatabaseError();
    });

  // Start the Express application, listening on the specified port
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}!!!`);
  });
};

// Call the start function to initiate server startup
start();

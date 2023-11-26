/**
 * registerUser function implements the logic for user registration.
 * It checks if the email is already registered, validates user permissions for assigning roles,
 * creates a new user, saves it to the database, and generates a JWT token for authentication.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @throws BadRequestError if the email is already registered or if the user doesn't have permission to assign roles
 * @returns 201 status with the user details and JWT token on successful registration
 * @author Toyeeb Atunde
 */

// Import necessary modules and models
import { Request, Response } from "express";
import { User } from "../../models";
import { BadRequestError, Password } from "../../../common";
import jwt from "jsonwebtoken";
import { UserDoc } from "../../models/UserInterface";
import { CreatedSuccessResponse } from "../../../common/success-response/created-success";

export const registerUser = async (req: Request, res: Response) => {
  // Extract user registration details from the request body
  const { email, password, role } = req.body;

  // Check if the email is already registered
  const existingUser = (await User.findOne({ email })) as UserDoc[];
  if (existingUser) {
    throw new BadRequestError("Email already registered");
  }

  // Check user permissions for assigning roles
  if (role && req.currentUser?.role !== "admin") {
    throw new BadRequestError("Permission denied", 403);
  }

  // Create a new user instance
  const user = User.build({
    email,
    password,
    role,
  });

  // Save the user to the database
  await user.save();

  // Generate JWT token for authentication
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_KEY!
  );

  // Prepare the response with user details and token
  // Create an instance of CreatedSuccessResponse
  const successResponse = new CreatedSuccessResponse({
    message: "User created successfully",
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      token: userJwt,
    },
  });

  // Set the HTTP status code and send the serialized response
  res.status(successResponse.statusCode).send(successResponse.serializedData());
};

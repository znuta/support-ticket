/**
 * loginUser function implements the logic for user login.
 * It checks if the user exists, compares the provided password with the stored password,
 * generates a JWT token for authentication, and sends the user details with the token.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @throws BadRequestError if the user is not found or if the provided credentials are invalid
 * @returns 200 status with the user details and JWT token on successful login
 * @author Toyeeb Atunde
 */

// Import necessary modules and models
import { Request, Response } from "express";
import { User } from "../../models";
import { BadRequestError, NotFoundError, Password } from "../../../common";
import jwt from "jsonwebtoken";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";

export const loginUser = async (req: Request, res: Response) => {
  // Extract user login details from the request body
  const { email, password } = req.body;

  // Check if the user exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  // Compare provided password with stored password
  const passwordsMatch = await Password.compare(
    password,
    existingUser.password
  );
  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  // Generate JWT token for authentication
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    },
    process.env.JWT_KEY!
  );

  // Prepare the response with user details and token
  // Create an instance of OkSuccessResponse
  const successResponse = new OkSuccessResponse({
    message: "User details updated successfully",
    data: {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      token: userJwt,
    },
  });

  // Send a 200 status with the response
  // Set the HTTP status code and send the serialized response
  res.status(successResponse.statusCode).send(successResponse.serializedData());
};

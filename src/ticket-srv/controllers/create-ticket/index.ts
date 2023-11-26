/**
 * createTicket.ts defines the logic for creating a new ticket.
 * It extracts the subject and description from the request body, and
 * creates a new ticket with the current user as the customer.
 *
 * @param req - Express request object
 * @param res - Express response object
 */

// Import the Request and Response types from the express module
import { Request, Response } from "express";

// Import the Ticket model for database operations
import { Ticket } from "../../models";
import { BadRequestError } from "../../../common";
import { CreatedSuccessResponse } from "../../../common/success-response/created-success";
import mongoose from "mongoose";

// Define the controller function for creating a new ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    // Extract the subject and description from the request body
    const { subject, description } = req.body;

    // Create a new ticket with the current user as the customer
    const newTicket = Ticket.build({
      customer: new mongoose.Types.ObjectId(req.currentUser?.id), // Assuming you have user authentication middleware
      subject,
      description,
    });

    // Save the new ticket to the database
    await newTicket.save();

    // Create an instance of CreatedSuccessResponse
    const successResponse = new CreatedSuccessResponse({
      message: "Ticket created successfully",
      data: newTicket,
    });

    // Set the HTTP status code and send the serialized response
    res
      .status(successResponse.statusCode)
      .send(successResponse.serializedData());
  } catch (error: any) {
    // Handle any errors and return a 500 response for internal server error
    console.error(error.message, error.statusCode);
    throw new BadRequestError(error.message, error.statusCode);
  }
};

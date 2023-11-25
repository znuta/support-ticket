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

// Define the controller function for creating a new ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    // Extract the subject and description from the request body
    const { subject, description } = req.body;

    // Create a new ticket with the current user as the customer
    const newTicket = new Ticket({
      customer: req.currentUser?.id, // Assuming you have user authentication middleware
      subject,
      description,
    });

    // Save the new ticket to the database
    await newTicket.save();

    res.status(201).json(newTicket);
  } catch (error) {
    // Handle any errors and return a 500 response for internal server error
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

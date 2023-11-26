/**
 * assignTicketToSelf.ts defines the logic for assigning a ticket to the requesting agent.
 * It checks if the user is an agent, if the ticket exists and is open, and if the ticket is
 * not already assigned. If these conditions are met, it assigns the ticket to the agent.
 *
 * @param req - Express request object
 * @param res - Express response object
 */

// Import the Request and Response types from the express module
import { Request, Response } from "express";

// Import the Ticket model for database operations
import { Ticket } from "../../models";

// Import mongoose for ObjectId handling
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../common";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";

// Define the controller function for assigning a ticket to the requesting agent
export const assignTicketToSelf = async (req: Request, res: Response) => {
  try {
    // Extract the ticket ID from the request parameters
    const ticketId = req.params.id;

    // Check if the user is an agent
    if (req.currentUser?.role !== "agent") {
      throw new BadRequestError("Permission denied", 403);
    }

    // Check if the ticket exists and is open
    const ticket = await Ticket.findOne({
      _id: ticketId,
      status: "open",
      assignedAgent: null,
    });

    // If the ticket is not found or already assigned, return a 404 response
    if (!ticket) {
      throw new NotFoundError("Ticket not found  or already assigned");
    }

    // Assign the ticket to the requesting agent
    ticket.assignedAgent = new mongoose.Types.ObjectId(req.currentUser?.id);
    await ticket.save();

    // Return a success message along with the updated ticket
    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "Ticket assigned successfully",
      data: ticket,
    });

    // Send a 200 status with the response
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

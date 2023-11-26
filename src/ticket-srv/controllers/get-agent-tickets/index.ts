/**
 * getAgentTickets.ts defines the logic for retrieving tickets assigned to the current support agent.
 * It fetches and returns the tickets assigned to the agent based on their user ID.
 *
 * @param req - Express request object
 * @param res - Express response object
 */

import { Request, Response } from "express";
import { Ticket } from "../../models";
import { BadRequestError } from "../../../common";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";

// Define the controller function for retrieving agent's tickets
export const getAgentTickets = async (req: Request, res: Response) => {
  try {
    // Retrieve tickets assigned to the support agent
    const agentTickets = await Ticket.find({
      assignedAgent: req.currentUser?.id,
    });

    // Send the retrieved tickets in the response
    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "Ticket fetched successfully",
      data: agentTickets,
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

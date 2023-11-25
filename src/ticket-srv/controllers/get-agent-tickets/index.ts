/**
 * getAgentTickets.ts defines the logic for retrieving tickets assigned to the current support agent.
 * It fetches and returns the tickets assigned to the agent based on their user ID.
 *
 * @param req - Express request object
 * @param res - Express response object
 */

import { Request, Response } from "express";
import { Ticket } from "../../models";

// Define the controller function for retrieving agent's tickets
export const getAgentTickets = async (req: Request, res: Response) => {
  try {
    // Retrieve tickets assigned to the support agent
    const agentTickets = await Ticket.find({
      assignedAgent: req.currentUser?.id,
    });

    // Send the retrieved tickets in the response
    res.status(200).json(agentTickets);
  } catch (error) {
    // Handle any errors and return a 500 response for internal server error
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

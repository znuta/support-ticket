/**
 * manageUsers and assignTicketToAgent functions in controllers.ts handle admin-specific actions.
 * manageUsers fetches all users, and assignTicketToAgent assigns a ticket to a specified agent.
 * Both functions include checks for admin permissions, fetch necessary data from models, and handle errors.
 *
 * @author Toyeeb Atunde
 */

// Import necessary modules
import { Request, Response } from "express";
import { User } from "../../auth-srv/models";
import { Ticket } from "../../ticket-srv/models";
import { BadRequestError, NotFoundError } from "../../common";
import { OkSuccessResponse } from "../../common/success-response/ok-success ";

/**
 * Fetch all users if the requesting user is an admin.
 * Responds with the list of users.
 */
export const manageUsers = async (req: Request, res: Response) => {
  try {
    // Check if the user is an admin
    if (req.currentUser?.role !== "admin") {
      throw new BadRequestError("Permission denied", 403);
    }

    // Fetch all users
    const users = await User.find();

    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "User fetched successfully",
      data: users,
    });

    // Send a 200 status with the response
    // Set the HTTP status code and send the serialized response
    res
      .status(successResponse.statusCode)
      .send(successResponse.serializedData());
  } catch (error: any) {
    console.error(error.message, error.statusCode);
    throw new BadRequestError(error.message, error.statusCode);
  }
};

/**
 * Assign a specified ticket to a specified agent if the requesting user is an admin.
 * Responds with a success message and the updated ticket details.
 */
export const assignTicketToAgent = async (req: Request, res: Response) => {
  try {
    // Check if the user is an admin
    if (req.currentUser?.role !== "admin") {
      throw new BadRequestError("Permission denied", 403);
    }

    const { ticketId, agentId } = req.body;

    // Check if the ticket and agent exist
    const ticket = await Ticket.findById(ticketId);
    const agent = await User.findById(agentId);

    if (!ticket || !agent) {
      throw new NotFoundError("Ticket or agent not found");
    }

    // Assign the ticket to the agent
    ticket.assignedAgent = agent.id;
    await ticket.save();

    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "Ticket assigned to agent successfully",
      data: ticket,
    });

    // Send a 200 status with the response
    // Set the HTTP status code and send the serialized response
    res
      .status(successResponse.statusCode)
      .send(successResponse.serializedData());
  } catch (error: any) {
    console.error(error.message, error.statusCode);
    throw new BadRequestError(error.message, error.statusCode);
  }
};

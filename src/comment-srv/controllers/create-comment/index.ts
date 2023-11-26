/**
 * createComment.ts defines the controller for creating a new comment on a ticket.
 * It includes logic to check if the ticket exists, if the user has permission to comment,
 * and handles scenarios where certain conditions must be met for commenting.
 *
 * @author Toyeeb Atunde
 */

// Import necessary modules
import { Request, Response } from "express";
import { Comment } from "../../models";
import { Ticket } from "../../../ticket-srv/models";
import { BadRequestError, NotFoundError } from "../../../common";
import { CreatedSuccessResponse } from "../../../common/success-response/created-success";
import mongoose from "mongoose";

// Controller function to create a new comment
export const createComment = async (req: Request, res: Response) => {
  try {
    // Destructure request body
    const { ticketId, text } = req.body;

    // Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    // Check if the requesting user has permission to comment on the ticket
    if (
      req.currentUser?.role !== "admin" &&
      req.currentUser?.id.toString() !== ticket.customer.toString() &&
      req.currentUser?.id.toString() !== ticket.assignedAgent?.toString()
    ) {
      throw new BadRequestError("Permission denied", 403);
    }

    // Check specific conditions for customer commenting
    if (req.currentUser?.id.toString() === ticket.customer.toString()) {
      // Check if a support agent has already commented on the ticket
      const agentComment = await Comment.findOne({
        ticket: ticketId,
        userRole: "agent",
      });

      if (!agentComment) {
        throw new BadRequestError(
          "Permission denied. A support agent must comment first.",
          403
        );
      }
    }

    // Create a new comment
    const newComment = Comment.build({
      ticket: ticketId,
      user: new mongoose.Types.ObjectId(req.currentUser?.id),
      text,
      userRole: req.currentUser?.role!,
    });

    await newComment.save();

    // Prepare the response with user details and token
    // Create an instance of CreatedSuccessResponse
    const successResponse = new CreatedSuccessResponse({
      message: "Comment created successfully",
      data: newComment,
    });

    // Set the HTTP status code and send the serialized response
    res
      .status(successResponse.statusCode)
      .send(successResponse.serializedData());
  } catch (error: any) {
    // Log and handle errors

    throw new BadRequestError(error.message, error.statusCode);
  }
};

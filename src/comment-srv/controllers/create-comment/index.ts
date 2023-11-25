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

// Controller function to create a new comment
export const createComment = async (req: Request, res: Response) => {
  try {
    // Destructure request body
    const { ticketId, text } = req.body;

    // Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the requesting user has permission to comment on the ticket
    if (
      req.currentUser?.role !== "admin" &&
      req.currentUser?.id.toString() !== ticket.customer.toString() &&
      req.currentUser?.id.toString() !== ticket.assignedAgent?.toString()
    ) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Check specific conditions for customer commenting
    if (req.currentUser?.id.toString() === ticket.customer.toString()) {
      // Check if a support agent has already commented on the ticket
      const agentComment = await Comment.findOne({
        ticket: ticketId,
        userRole: "agent",
      });

      if (!agentComment) {
        return res.status(403).json({
          message: "Permission denied. A support agent must comment first.",
        });
      }
    }

    // Create a new comment
    const newComment = new Comment({
      ticket: ticketId,
      user: req.currentUser?.id,
      text,
      userRole: req.currentUser?.role,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import { Request, Response } from "express";
import { Ticket } from "../../models";
import mongoose from "mongoose";

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    // Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update ticket details
    ticket.status = status;

    // If the status is "closed," update the closedAt field
    if (status === "closed" && !ticket.closedAt) {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    res.status(200).json({ message: "Ticket details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

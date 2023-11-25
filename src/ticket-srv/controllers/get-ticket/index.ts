import { Request, Response } from "express";
import { Ticket } from "../../models";
import mongoose from "mongoose";

export const getTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;

    // Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Return ticket details
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

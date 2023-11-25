import { Request, Response } from "express";
import { Ticket } from "../../models";
import mongoose from "mongoose";

export const getUnassignedTickets = async (req: Request, res: Response) => {
  try {
    // Check if the user is an agent
    if (
      req.currentUser?.role !== "agent" &&
      req.currentUser?.role !== "admin"
    ) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Fetch all tickets that are open and not assigned to any agent
    const unassignedTickets = await Ticket.find({
      status: "open",
      assignedAgent: null,
    });

    res.status(200).json(unassignedTickets);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

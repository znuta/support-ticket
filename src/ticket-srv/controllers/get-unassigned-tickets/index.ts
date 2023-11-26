import { Request, Response } from "express";
import { Ticket } from "../../models";
import mongoose from "mongoose";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";
import { BadRequestError } from "../../../common";

export const getUnassignedTickets = async (req: Request, res: Response) => {
  try {
    // Check if the user is an agent
    if (
      req.currentUser?.role !== "agent" &&
      req.currentUser?.role !== "admin"
    ) {
      throw new BadRequestError("Permission denied", 403);
    }

    // Fetch all tickets that are open and not assigned to any agent
    const unassignedTickets = await Ticket.find({
      status: "open",
      assignedAgent: null,
    });

    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "Ticket fetched successfully",
      data: unassignedTickets,
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

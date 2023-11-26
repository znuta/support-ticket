import { Request, Response } from "express";
import { Ticket } from "../../models";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../common";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;

    // Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    // Update ticket details
    ticket.status = status;

    // If the status is "closed," update the closedAt field
    if (status === "closed" && !ticket.closedAt) {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "Ticket details updated successfully",
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

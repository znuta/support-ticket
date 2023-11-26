/**
 * updateComment.ts defines the controller for updating the details of a specific comment.
 * It includes logic to check if the comment id is provided, if the comment exists,
 * if the requesting user has permission to update the comment, and handles error scenarios.
 *
 * @author Toyeeb Atunde
 */

// Import necessary modules
import { Request, Response } from "express";
import { Comment } from "../../models";
import { Ticket } from "../../../ticket-srv/models";
import { BadRequestError, NotFoundError } from "../../../common";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";

// Controller function to update details of a specific comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    // Extract commentId and text from request parameters and body
    const commentId = req.params.id;
    const { text } = req.body;

    // Check if commentId is provided
    if (!commentId) throw new BadRequestError("Comment id must be passed");

    // Check if the comment exists
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    // Check if the requesting user has permission to update the comment
    if (req.currentUser?.id.toString() !== comment.user.toString()) {
      throw new BadRequestError("Permission denied", 403);
    }

    // Update comment details
    comment.text = text;
    await comment.save();
    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "Comment details updated successfully",
      data: comment,
    });

    // Send a 200 status with the response
    // Set the HTTP status code and send the serialized response
    res
      .status(successResponse.statusCode)
      .send(successResponse.serializedData());
  } catch (error: any) {
    // Log and handle errors
    console.error(error.message, error.statusCode);
    throw new BadRequestError(error.message, error.statusCode);
  }
};

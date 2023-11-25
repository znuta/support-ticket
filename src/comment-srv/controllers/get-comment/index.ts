/**
 * getComment.ts defines the controller for retrieving details of a specific comment.
 * It includes logic to check if the comment id is provided, if the comment exists,
 * and handles error scenarios.
 *
 * @author Toyeeb Atunde
 */

// Import necessary modules
import { Request, Response } from "express";
import { Comment } from "../../models";
import { Ticket } from "../../../ticket-srv/models";
import { BadRequestError } from "../../../common";

// Controller function to get details of a specific comment
export const getComment = async (req: Request, res: Response) => {
  try {
    // Extract commentId from request parameters
    const commentId = req.params.id;

    // Check if commentId is provided
    if (!commentId) throw new BadRequestError("Comment id must be passed");

    // Check if the comment exists
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Return comment details
    res.status(200).json(comment);
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

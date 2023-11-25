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
import { BadRequestError } from "../../../common";

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
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the requesting user has permission to update the comment
    if (req.currentUser?.id.toString() !== comment.user.toString()) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Update comment details
    comment.text = text;
    await comment.save();

    res.status(200).json({ message: "Comment details updated successfully" });
  } catch (error) {
    // Log and handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

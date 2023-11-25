import { Request, Response } from "express";
import { User } from "../../models";
import { BadRequestError, Password } from "../../../common";

/**
 * Implement get user details logic
 * @param req
 * @param res
 */

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      throw new BadRequestError("User not found", 404);
    }

    // Ensure that the requesting user has permission to access this user's details
    if (
      req.currentUser?.role !== "admin" &&
      req.currentUser?.id.toString() !== userId
    ) {
      throw new BadRequestError("Permission denied", 403);
    }

    // Return user details
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Internal Server Error");
  }
};

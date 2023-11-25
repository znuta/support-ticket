import { Request, Response } from "express";
import { User } from "../../models";
import { BadRequestError, Password } from "../../../common";
import jwt from "jsonwebtoken";

/**
 * Implement update user details logic
 * @param req
 * @param res
 * @returns
 */

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      throw new BadRequestError("User not found", 404);
    }

    // Ensure that the requesting user has permission to update this user's details
    if (
      req.currentUser?.role !== "admin" &&
      req.currentUser?.id.toString() !== userId
    ) {
      throw new BadRequestError("Permission denied", 403);
    }

    // Update user details
    user.password = password;
    await user.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Internal Server Error");
  }
};

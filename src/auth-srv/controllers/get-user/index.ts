import { Request, Response } from "express";
import { User } from "../../models";
import { BadRequestError, NotFoundError, Password } from "../../../common";
import { OkSuccessResponse } from "../../../common/success-response/ok-success ";

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
      throw new NotFoundError("User not found");
    }

    // Ensure that the requesting user has permission to access this user's details
    if (
      req.currentUser?.role !== "admin" &&
      req.currentUser?.id.toString() !== userId
    ) {
      throw new BadRequestError("Permission denied", 403);
    }

    // Prepare the response with user details and token
    // Create an instance of OkSuccessResponse
    const successResponse = new OkSuccessResponse({
      message: "User details updated successfully",
      data: user,
    });

    // Send a 200 status with the response
    // Set the HTTP status code and send the serialized response
    res
      .status(successResponse.statusCode)
      .send(successResponse.serializedData());
  } catch (error: any) {
    console.error(error.message, error.statusCode);
    throw new BadRequestError(error.message, error.statusCode);
  }
};

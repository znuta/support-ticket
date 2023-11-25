/**
 * errorHandler middleware is responsible for handling errors thrown within the application.
 * It formats custom errors that extend the CustomResponse class and sends appropriate responses.
 *
 * @function errorHandler
 * @param {Error} err - The error object
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 * @returns {void}
 *
 * @author Toyeeb Atunde
 */
import { Request, Response, NextFunction } from "express";
import { CustomResponse } from "../errors/customResponse";

/**
 * errorHandler middleware function.
 * @param {Error} err - The error object
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the error is an instance of the CustomResponse class
  if (err instanceof CustomResponse) {
    // If it is, send a formatted response with the error details
    return res.status(err.statusCode).send({ error: err.serializedError() });
  }

  // If the error is not a custom error, log the error details
  console.error("Error:", err);

  // Send a generic error response for unhandled errors
  res
    .status(500)
    .send({ error: [{ message: "something went wrong! it's not you" }] });
};

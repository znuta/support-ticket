/**
 * ValidationResult middleware is responsible for checking the validation results
 * of the express-validator and handling errors if validation fails.
 *
 * @function ValidationResult
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 * @returns {void}
 *
 * @author Toyeeb Atunde
 */
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { validationError } from "../errors/validation-error";

/**
 * ValidationResult middleware function.
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 */
export const ValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check validation results from express-validator
  const error = validationResult(req);

  // If there are validation errors, throw a validationError
  if (!error.isEmpty()) {
    throw new validationError(error.array());
  }

  // If there are no validation errors, proceed to the next middleware
  next();
};

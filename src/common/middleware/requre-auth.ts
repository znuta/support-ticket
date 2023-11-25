/**
 * requireAuth middleware ensures that a user is authenticated before allowing access
 * to protected routes. If the user is not authenticated, it throws a NotAuthorizeError.
 *
 * @function requireAuth
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 * @throws {NotAuthorizeError} Throws a NotAuthorizeError if the user is not authenticated
 * @returns {void}
 *
 * @author Toyeeb Atunde
 */
import { Request, Response, NextFunction } from "express";
import { NotAuthorizeError } from "../errors/not-authorize-error";

/**
 * requireAuth middleware function.
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the user is authenticated
  if (!req.currentUser) {
    // If not authenticated, throw a NotAuthorizeError
    throw new NotAuthorizeError();
  }

  // If authenticated, proceed to the next middleware
  next();
};

/**
 * currentUser middleware is responsible for extracting the user payload from the JWT token
 * present in the request headers and attaching it to the request object for further use.
 *
 * @function currentUser
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 * @returns {void}
 * @global
 */
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * userPayload is an interface representing the structure of the user payload in the JWT token.
 * @interface userPayload
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} role - User role
 * @property {string | undefined} name - Optional user name
 */
interface userPayload {
  id: string;
  email: string;
  role: string;
  name?: string;
}

/**
 * Extends the Request interface in the Express namespace to include currentUser property.
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: userPayload;
    }
  }
}

/**
 * currentUser middleware function.
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction middleware callback
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the authorization header is present in the request
  if (req.headers["authorization"]) {
    // Extract the JWT token from the authorization header
    const accessTokenKey = req.headers["authorization"].split(" ")[1];

    /* token-based authentication */
    try {
      // Verify the JWT token and extract the payload
      const payload = jwt.verify(
        accessTokenKey,
        process.env.JWT_KEY!
      ) as userPayload;

      // Attach the user payload to the request object
      req.currentUser = payload;
    } catch (error) {
      console.error("JWT ERROR:", error);
    }

    // Continue with the next middleware in the chain
    next();
  } else {
    // If there is no authorization header, continue with the next middleware
    next();
  }
};

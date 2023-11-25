/**
 * roleBased middleware restricts access to routes based on user roles.
 * If the user's role is not included in the specified roles, it throws a BadRequestError.
 *
 * @function roleBased
 * @param {Role[]} role - An array of roles that are allowed to access the route
 * @returns {Function} Express middleware function
 * @throws {BadRequestError} Throws a BadRequestError if the user's role is not authorized
 *
 * @author Toyeeb Atunde
 */

import express, { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { Role } from "../../auth-srv/models/UserInterface";

/**
 * roleBased middleware function.
 * @param {Role[]} role - An array of roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
export const roleBased =
  (role: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    // Get the user's role from the request
    const userRole = req.currentUser?.role;

    // Check if the user's role is included in the specified roles
    //@ts-ignore
    if (!role.includes(userRole)) {
      // If not authorized, throw a BadRequestError
      throw new BadRequestError("Unauthorized");
    } else {
      // If authorized, proceed to the next middleware
      return next();
    }
  };

// Import the express module for creating the router
import express from "express";

// Import the ticket controller methods
import {
  createTicket,
  getTicket,
  updateTicket,
  getAgentTickets,
  assignTicketToSelf,
  getUnassignedTickets,
  generateTicketReport,
} from "../controllers";

// Import validation middleware, authentication middleware, and role-based access control
import { ValidationResult, requireAuth, roleBased } from "../../common";

// Import express-validator for request validation
import { body } from "express-validator";

// Create an instance of the express router
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Routes for handling ticket-related operations
 */

/**
 * @swagger
 *   /api/v1/ticket/create:
 *     post:
 *       summary: Create a new ticket
 *       tags: [Tickets]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject:
 *                   type: string
 *                 description:
 *                   type: string
 *               required:
 *                 - subject
 *                 - description
 *       responses:
 *         201:
 *           description: Ticket created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         422:
 *           description: Validation error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

router.post(
  "/create",
  [
    // Validation for the subject field
    body("subject").trim().notEmpty().withMessage("Subject must be valid"),

    // Validation for the description field
    body("description")
      .trim()
      .notEmpty()
      .withMessage("You must pass your description"),
  ],
  ValidationResult, // Validation result middleware
  requireAuth, // Authentication middleware
  createTicket // Controller method for creating a ticket
);

/**
 * @swagger
 *   /api/v1/ticket/unassigned/tickets:
 *     get:
 *       summary: Get unassigned tickets
 *       tags: [Tickets]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Unassigned tickets retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         403:
 *           description: Forbidden - User does not have agent or admin role
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/unassigned/tickets",
  requireAuth, // Authentication middleware
  roleBased(["agent", "admin"]), // Role-based access control
  getUnassignedTickets // Controller method for getting unassigned tickets
);

/**
 * @swagger
 *   /api/v1/ticket/support-agents/tickets:
 *     get:
 *       summary: Get tickets assigned to the requesting agent
 *       tags: [Tickets]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Agent's tickets retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         403:
 *           description: Forbidden - User does not have agent role
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/support-agents/tickets",
  requireAuth, // Authentication middleware
  roleBased(["agent"]), // Role-based access control
  getAgentTickets // Controller method for getting agent's tickets
);

/**
 * @swagger
 *   /api/v1/ticket/report:
 *     get:
 *       summary: Generate and export the ticket report
 *       tags: [Tickets]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: format
 *           in: query
 *           description: "The desired format of the report"
 *           required: true
 *           type: string
 *           enum:
 *             - csv
 *             - json
 *             - pdf
 *       responses:
 *         200:
 *           description: Ticket report generated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         403:
 *           description: Forbidden - User does not have agent or admin role
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

router.get(
  "/report",
  requireAuth, // Authentication middleware
  roleBased(["agent", "admin"]), // Role-based access control
  generateTicketReport // Controller method for generating the ticket report
);

/**
 * @swagger
 *   /api/v1/ticket/assign/{id}:
 *     put:
 *       summary: Assign a ticket to the requesting agent
 *       tags: [Tickets]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the ticket to be assigned
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Ticket assigned successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         403:
 *           description: Forbidden - User does not have agent role
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         404:
 *           description: Ticket not found or already assigned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/assign/:id",
  requireAuth, // Authentication middleware
  roleBased(["agent"]), // Role-based access control
  assignTicketToSelf // Controller method for assigning a ticket to the agent
);

/**
 * @swagger
 *   /api/v1/ticket/{id}:
 *     get:
 *       summary: Get a specific ticket by ID
 *       tags: [Tickets]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the ticket to be retrieved
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Ticket retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         404:
 *           description: Ticket not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", requireAuth, getTicket);

/**
 * @swagger
 *   /api/v1/ticket/{id}:
 *     put:
 *       summary: Update a specific ticket by ID
 *       tags: [Tickets]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the ticket to be updated
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subject:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *               required:
 *       responses:
 *         200:
 *           description: Ticket updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         403:
 *           description: Forbidden - User does not have agent role
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         404:
 *           description: Ticket not found
 *
 *
 */
router.put("/:id", requireAuth, updateTicket);

// Export the router as ticketRoutes
export { router as ticketRoutes };

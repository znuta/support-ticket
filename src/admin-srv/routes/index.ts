// Import necessary modules
import express from "express";
import { manageUsers, assignTicketToAgent } from "../controllers";
import { requireAuth, roleBased } from "../../common";

// Create an express router
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Routes for admin-specific actions
 */

/**
 * @swagger
 *   /api/v1/admin/users:
 *     get:
 *       summary: Get all users
 *       tags: [Admin]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Users retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     // Define your user properties here
 *         401:
 *           description: Unauthorized
 *         403:
 *           description: Forbidden - User does not have admin role
 *         500:
 *           description: Internal Server Error
 */
router.get("/users", requireAuth, roleBased(["admin"]), manageUsers);

/**
 * @swagger
 *   /api/v1/admin/assign-ticket:
 *     post:
 *       summary: Assign a ticket to an agent
 *       tags: [Admin]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketId:
 *                   type: string
 *                 agentId:
 *                   type: string
 *               required:
 *                 - ticketId
 *                 - agentId
 *       responses:
 *         200:
 *           description: Ticket assigned to agent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         401:
 *           description: Unauthorized
 *         403:
 *           description: Forbidden - User does not have admin role
 *         404:
 *           description: Ticket or agent not found
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
  "/assign-ticket",
  requireAuth,
  roleBased(["admin"]),
  assignTicketToAgent
);

// Export the router
export { router as adminRoutes };

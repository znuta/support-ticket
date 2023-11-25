// Import necessary modules
import express from "express";
import { createComment, getComment, updateComment } from "../controllers";
import { ValidationResult, requireAuth } from "../../common";
import { body } from "express-validator";

// Create an instance of the Express Router
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Routes for comment-related operations
 */

/**
 * @swagger
 * path:
 *   /api/v1/comment/create:
 *     post:
 *       summary: Create a new comment
 *       tags: [Comments]
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
 *                 text:
 *                   type: string
 *               required:
 *                 - ticketId
 *                 - text
 *       responses:
 *         201:
 *           description: Comment created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         400:
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         401:
 *           description: Unauthorized
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
    body("ticketId")
      .trim()
      .notEmpty()
      .withMessage("You must pass in the ticket id"),
    body("text").trim().notEmpty().withMessage("You must pass in the comment"),
  ],
  ValidationResult,
  requireAuth,
  createComment
);

/**
 * @swagger
 * path:
 *   /api/v1/comment/{id}:
 *     get:
 *       summary: Get a comment by ID
 *       tags: [Comments]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the comment
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Comment retrieved successfully
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
 *           description: Comment not found
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
router.get("/:id", requireAuth, getComment);

/**
 * @swagger
 * path:
 *   /api/v1/comment/{id}:
 *     put:
 *       summary: Update a comment by ID
 *       tags: [Comments]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the comment
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *               required:
 *                 - text
 *       responses:
 *         200:
 *           description: Comment updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         400:
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         404:
 *           description: Comment not found
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
  "/:id",
  [body("text").trim().notEmpty().withMessage("You must pass in the comment")],
  ValidationResult,
  requireAuth,
  updateComment
);

// Export the comment routes
export { router as commentRoutes };

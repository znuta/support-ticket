import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../../swaggerConfig";

const router = express.Router();

// Swagger UI route
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { router as swaggerRoutes };

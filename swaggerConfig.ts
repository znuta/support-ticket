import swaggerJSDoc from "swagger-jsdoc";

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for support ticket",
    },
    components: {
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates whether the operation was successful.",
              example: true,
            },
            message: {
              type: "string",
              description: "A brief description of the success.",
              example: "Resource created successfully",
            },
            data: {
              type: "object",
              description:
                "Additional data associated with the success (if applicable).",
              example: {},
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates whether the operation was successful.",
              example: false,
            },
            message: {
              type: "string",
              description: "A brief description of the error.",
              example: "Bad Request",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    description:
                      "The field associated with the error (if applicable).",
                  },
                  message: {
                    type: "string",
                    description: "A detailed error message.",
                  },
                },
              },
              description: "An array of detailed error messages.",
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/auth-srv/routes/*.ts",
    "./src/ticket-srv/routes/*.ts",
    "./src/comment-srv/routes/*.ts",
    "./src/admin-srv/routes/*.ts",
    "./src/auth-srv/models/*.ts",
  ],
};

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJSDoc(swaggerOptions);

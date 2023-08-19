const swaggerJSDoc = require("swagger-jsdoc")

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     jwtToken:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API Documentation",
      version: "1.0.0",
      description: "API documentation for my e-commerce backend",
    },
  },
  apis: ["./routes/*.js"], // Path to your route files
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec


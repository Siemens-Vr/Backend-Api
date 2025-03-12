const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Premium ERP API",
      version: "1.0.0",
      description: "API Documentation for Password Reset Logic 🚀",
    },
    servers: [{ url: "http://localhost:5000/api" }],
  },
  apis: ["./routes/*.js"], // Path to API routes
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs at http://localhost:5000/api-docs`);
};

module.exports = swaggerDocs;

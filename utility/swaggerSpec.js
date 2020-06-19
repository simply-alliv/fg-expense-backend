const swaggerJSDoc = require("swagger-jsdoc");

// Swagger definition
const swaggerDefinition = {
  info: {
    openapi: "3.0.0", // Version of swagger
    title: "REST API for FG Expense Tracker", // Title of the documentation
    version: "1.0.0", // Version of the app
    description:
      "This is the REST API Documentation for the FG Expense Tracker created by the backend team.", // short description of the app
  },
  basePath: "/", // the basepath of your endpoint
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["docs/**/*.yaml"],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

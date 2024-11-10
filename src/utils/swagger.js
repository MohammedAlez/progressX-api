const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Swagger version
    info: {
      title: 'Express API', // API title
      version: '1.0.0', // API version
      description: 'API documentation for my Express app',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Your server URL
      },
    ],
  },
  // Path to the API specs
  apis: ['./src/routes/*.js'], // Specify your route files where JSDoc comments are added
};

// Create Swagger docs
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerSpec, swaggerUi };
export const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'MNEE API',
        version: '1.0.0',
        description: 'API documentation for MNEE project',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./src/routes/*.js'],
  };
  
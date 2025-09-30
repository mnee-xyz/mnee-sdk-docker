export const swaggerOptions = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'MNEE SDK API Wrapper',
        version: '1.0.0',
        description: 'API documentation for MNEE SDK',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
        },
      ],
    },
    apis: ['./src/routes/*.js'],
  };
  
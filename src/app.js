import express from 'express';
import balanceRoutes from './routes/balance.js';
import utxoRoutes from './routes/utxo.js'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from '../swaggerOptions.js';
import transactionRoutes from './routes/transaction.js'
import parseRoutes from './routes/parse.js'
import configRoutes from './routes/config.js'
import { errorHandler } from './middleware/errorHandler.js';


const app = express();
app.set('case sensitive routing', true)
app.use(express.json());
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (['POST'].includes(req.method)) {
      if (!contentType.includes('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Content-Type. Expected application/json',
        });
      }
    }
    next();
});

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/balance', balanceRoutes);
app.use('/api/utxos', utxoRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/parse', parseRoutes);
app.use('/api/config', configRoutes);

app.use(errorHandler);

export default app;

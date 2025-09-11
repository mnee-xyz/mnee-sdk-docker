import express from 'express';
import balanceRoutes from './routes/balance.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/api/balance', balanceRoutes);

app.use(errorHandler);

export default app;

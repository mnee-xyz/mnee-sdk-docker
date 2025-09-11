import express from 'express';
import balanceRoutes from './routes/balance.js';
import utxoRoutes from './routes/utxo.js'
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/api/balance', balanceRoutes);
app.use('/api/utxos', utxoRoutes)

app.use(errorHandler);

export default app;

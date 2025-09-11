import express from 'express';
import { getBalance, getBalances } from '../controllers/balanceController.js';

const router = express.Router();

// GET balance
router.get('/:address', getBalance);
// GET balances, pass address in array
router.get("/", getBalances); 

export default router;

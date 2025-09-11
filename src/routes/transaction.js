import express from 'express';
import {
  getRecentTxHistory,
  getRecentTxHistories,
  getTxStatus,
  transfer,
  transferMulti,
  submitRawTx
} from '../controllers/transactionController.js';

const router = express.Router();

// Get recent transaction history for a single address
router.get('/:address', getRecentTxHistory);

// Get transaction histories for multiple addresses
router.post('/histories', getRecentTxHistories);

// Get status of a transfer by ticketId
router.get('/status/:ticketId', getTxStatus);

// POST transfer using single input
router.post('/transfer', transfer);

// POST transfer using multiple inputs
router.post('/transfer-multi', transferMulti);

// POST submit raw transaction hex
router.post('/submit-rawtx', submitRawTx);

export default router;

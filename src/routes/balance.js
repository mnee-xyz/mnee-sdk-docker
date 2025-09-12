import express from 'express';
import { getBalance, getBalances } from '../controllers/balanceController.js';

const router = express.Router();

/**
 * @swagger
 * /api/balance/{address}:
 *   get:
 *     summary: Get balance by address
 *     tags:
 *       - Balance
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet address to query balance for
 *     responses:
 *       200:
 *         description: Successfully retrieved balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 address:
 *                   type: string
 *                 balance:
 *                   type: number
 *       400:
 *         description: Invalid address
 */
router.get('/:address', getBalance);

/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Get balances for multiple addresses
 *     tags:
 *       - Balance
 *     parameters:
 *       - in: query
 *         name: addresses
 *         required: true
 *         schema:
 *           type: string
 *           example: "addr1,addr2,addr3"
 *         description: Comma-separated list of wallet addresses (e.g., ?addresses=addr1,addr2,addr3)
 *     responses:
 *       200:
 *         description: Successfully retrieved multiple balances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   balance:
 *                     type: number
 *       400:
 *         description: Invalid addresses parameter
 */
router.get('/', getBalances);

export default router;

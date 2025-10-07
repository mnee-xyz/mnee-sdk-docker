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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       example: "string"
 *                     amount:
 *                       type: integer
 *                       example: 0
 *                     decimalAmount:
 *                       type: number
 *                       example: 0
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "string"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "string"
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: "string"
 *                       amount:
 *                         type: integer
 *                         example: 0
 *                       decimalAmount:
 *                         type: number
 *                         example: 0
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "string"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "string"
 */
router.get('/', getBalances);

export default router;

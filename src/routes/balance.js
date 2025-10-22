import express from 'express';
import { getBalance, getBalances } from '../controllers/balanceController.js';

const router = express.Router({caseSensitive: true});

/**
 * @swagger
 * components:
 *   schemas:
 *     BalanceResponse:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           description: The Bitcoin address that was queried
 *           example: "1G6CB3Ch4zFkPmuhZzEyChQmrQPfi86qk3"
 *         amount:
 *           type: integer
 *           description: The balance in atomic units (100,000 atomic units = 1 MNEE)
 *           example: 5040077649639
 *         decimalAmount:
 *           type: number
 *           format: float
 *           description: The balance in MNEE (human-readable format with decimals)
 *           example: 50400776.49639
 */

/**
 * @swagger
 * /api/balance/{address}:
 *   get:
 *     summary: Get balance for a single wallet address
 *     description: |
 *       Retrieves the balance for a specific MNEE address.
 *       This method is useful for checking how many MNEE tokens are associated with a given address.
 *       
 *     tags:
 *       - Balance
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The address to retrieve the balance for.
 *         example: "1G6CB3Ch4zFkPmuhZzEyChQmrQPfi86qk3"
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BalanceResponse'
 *             example:
 *                   success: true
 *                   data:
 *                     address: "1G6CB3Ch4zFkPmuhZzEyChQmrQPfi86qk3"
 *                     amount: 5040077649639
 *                     decimalAmount: 50400776.49639
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
 */
router.get('/:address', getBalance);

/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Get balances for multiple addresses
 *     description: |
 *       Retrieves the balances for multiple MNEE addresses in a single call.
 *       This is useful for checking the balances of several addresses at once.
 *       
 *       **Important Notes**:
 *       - Addresses should be comma-separated without spaces
 *       - Invalid addresses in the list will be skipped or return an error
 *       
 *     tags:
 *       - Balance
 *     parameters:
 *       - in: query
 *         name: addresses
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of addresses (no spaces).
 *         example: "1G6CB3Ch4zFkPmuhZzEyChQmrQPfi86qk3,1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa,1Gw5HiwzTkP9Ntf1U72qNM1Cp84Nakp1N6"
 *     responses:
 *       200:
 *         description: Balances retrieved successfully for all addresses
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
 *                     $ref: '#/components/schemas/BalanceResponse'
 *             example:
 *                   success: true
 *                   data:
 *                     - address: "1G6CB3Ch4zFkPmuhZzEyChQmrQPfi86qk3"
 *                       amount: 5040077649639
 *                       decimalAmount: 50400776.49639
 *                     - address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
 *                       amount: 216072
 *                       decimalAmount: 2.16072
 *                     - address: "1Gw5HiwzTkP9Ntf1U72qNM1Cp84Nakp1N6"
 *                       amount: 0
 *                       decimalAmount: 0
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
 */
router.get('/', getBalances);

export default router;

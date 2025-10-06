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

/**
 * @swagger
 * /api/transaction/{address}:
 *   get:
 *     summary: Get recent transaction history for a single address
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Address to fetch transaction history
 *       - in: query
 *         name: fromScore
 *         schema:
 *           type: number
 *         description: Pagination cursor from score
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *         description: Number of results to return
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order
 *     responses:
 *       200:
 *         description: Recent transaction history
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
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           txid:
 *                             type: string
 *                             example: "string"
 *                           height:
 *                             type: number
 *                             example: 0
 *                           type:
 *                             type: string
 *                             example: "string"
 *                           status:
 *                             type: string
 *                             example: "string"
 *                           amount:
 *                             type: number
 *                             example: 0
 *                           fee:
 *                             type: number
 *                             example: 0
 *                           score:
 *                             type: number
 *                             example: 0
 *                           counterparties:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 address:
 *                                   type: string
 *                                   example: "string"
 *                                 amount:
 *                                   type: number
 *                                   example: 0
 *                     nextScore:
 *                       type: number
 *                       example: 0
 *       500:
 *         description: Internal server error
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
router.get('/:address', getRecentTxHistory);

/**
 * @swagger
 * /api/transaction/histories:
 *   post:
 *     summary: Get recent transaction histories for multiple addresses
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       example: "your-address1"
 *                     fromScore:
 *                       type: number
 *                       example: 0
 *                     limit:
 *                       type: number
 *                       example: 10
 *     responses:
 *       200:
 *         description: Transaction histories of multiple addresses
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
 *                       history:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             txid:
 *                               type: string
 *                               example: "string"
 *                             height:
 *                               type: number
 *                               example: 0
 *                             type:
 *                               type: string
 *                               example: "string"
 *                             status:
 *                               type: string
 *                               example: "string"
 *                             amount:
 *                               type: number
 *                               example: 0
 *                             fee:
 *                               type: number
 *                               example: 0
 *                             score:
 *                               type: number
 *                               example: 0
 *                             counterparties:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   address:
 *                                     type: string
 *                                     example: "string"
 *                                   amount:
 *                                     type: number
 *                                     example: 0
 *                       nextScore:
 *                         type: number
 *                         example: 0
 *       500:
 *         description: Internal server error
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
router.post('/histories', getRecentTxHistories);

/**
 * @swagger
 * /api/transaction/status/{ticketId}:
 *   get:
 *     summary: Get status of a transfer by ticketId
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID to get status for
 *     responses:
 *       200:
 *         description: Status of transaction
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
 *                     id:
 *                       type: string
 *                       example: "string"
 *                     tx_id:
 *                       type: string
 *                       example: "string"
 *                     tx_hex:
 *                       type: string
 *                       example: "string"
 *                     action_requested:
 *                       type: string
 *                       example: "string"
 *                     status:
 *                       type: string
 *                       example: "string"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "string"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "string"
 *                     errors:
 *                       type: string
 *                       nullable: true
 *                       example: null
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
router.get('/status/:ticketId', getTxStatus);

/**
 * @swagger
 * /api/transaction/transfer:
 *   post:
 *     summary: Transfer MNEE tokens using single input
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     amount:
 *                       type: number
 *               wif:
 *                 type: string
 *               transferOptions:
 *                 type: object
 *                 properties:
 *                   callbackUrl:
 *                     type: string
 *                   broadcast:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
router.post('/transfer', transfer);

/**
 * @swagger
 * /api/transaction/transfer-multi:
 *   post:
 *     summary: Transfer MNEE tokens from multiple source UTXOs
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               options:
 *                 type: object
 *                 properties:
 *                   inputs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         txid:
 *                           type: string
 *                         vout:
 *                           type: number
 *                         wif:
 *                           type: string
 *                   recipients:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         address:
 *                           type: string
 *                         amount:
 *                           type: number
 *                   changeAddress:
 *                     type: string
 *               transferOptions:
 *                 type: object
 *                 properties:
 *                   callbackUrl:
 *                     type: string
 *                   broadcast:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Multi-transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
router.post('/transfer-multi', transferMulti);

/**
 * @swagger
 * /api/transaction/submit-rawtx:
 *   post:
 *     summary: Submit raw transaction hex
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rawTxHex:
 *                 type: string
 *                 example: "raw transaction hex string"
 *               transferOptions:
 *                 type: object
 *                 properties:
 *                   callbackUrl:
 *                     type: string
 *                   broadcast:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Raw transaction submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketId:
 *                   type: string
 *                   example: "string"
 *                 rawtx:
 *                   type: string
 *                   example: "string"
 *       500:
 *         description: Internal server error
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
router.post('/submit-rawtx', submitRawTx);

export default router;

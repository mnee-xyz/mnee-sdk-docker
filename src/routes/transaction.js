import express from 'express';
import {
  getRecentTxHistory,
  getRecentTxHistories,
  getTxStatus,
  transfer,
  transferMulti,
  submitRawTx
} from '../controllers/transactionController.js';

const router = express.Router({caseSensitive: true});

/**
 * @swagger
 * components:
 *   schemas:
 *     Counterparty:
 *       type: object
 *       description: Other party involved in the transaction
 *       properties:
 *         address:
 *           type: string
 *           description: The counterparty's address
 *           example: "1VVpP4WNNYZWQ9ySL4nUuor8g9RUETaLM"
 *         amount:
 *           type: number
 *           description: Amount sent to/from this address
 *           example: 70000
 *
 *     TransactionHistoryItem:
 *       type: object
 *       properties:
 *         txid:
 *           type: string
 *           description: Transaction identifier
 *           example: "5acdba02375a845492f022a276c10a7ef1f5dd073c0182795b02a9b51572715f"
 *         height:
 *           type: number
 *           description: Block height (0 for unconfirmed)
 *           example: 913627
 *         type:
 *           type: string
 *           description: Type of transaction
 *           example: "receive"
 *           enum: [send, receive]
 *         status:
 *           type: string
 *           description: Current transaction status
 *           example: "confirmed"
 *           enum: [unconfirmed, confirmed]
 *         amount:
 *           type: number
 *           description: Amount in atomic units
 *           example: 70000
 *         fee:
 *           type: number
 *           description: Transaction fee in atomic units
 *           example: 0
 *         score:
 *           type: number
 *           description: Sortable score for pagination
 *           example: 913627000012998
 *         counterparties:
 *           type: array
 *           description: Other addresses involved in this transaction
 *           items:
 *             $ref: '#/components/schemas/Counterparty'
 *
 *     TransferRecipient:
 *       type: object
 *       required:
 *         - address
 *         - amount
 *       properties:
 *         address:
 *           type: string
 *           description: Recipient Bitcoin address
 *           example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *         amount:
 *           type: number
 *           description: Amount to send in MNEE (not atomic units)
 *           example: 0.01
 *     TransferOptions:
 *       type: object
 *       properties:
 *         callbackUrl:
 *           type: string
 *           description: Webhook URL for status updates (only when broadcast is true)
 *           example: "https://your-server.com/webhook/tx-confirmed"
 *         broadcast:
 *           type: boolean
 *           description: Whether to broadcast the transaction (default = true)
 *           default: true
 *           example: true
 *
 *     TicketStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ticket ID
 *           example: "5d9dd4c1-8360-4d80-aa9d-96552a9bd9fa"
 *         tx_id:
 *           type: string
 *           description: The blockchain transaction ID
 *           example: "05a8d8a4cbf7e762c1a18ac755321d793b9345b73045c9d920c6d08abf06b1fc"
 *         tx_hex:
 *           type: string
 *           description: The raw transaction hex
 *           example: "0100000001..."
 *         action_requested:
 *           type: string
 *           description: The requested action
 *           example: "transfer"
 *         status:
 *           type: string
 *           description: Current status
 *           example: "MINED"
 *           enum: [MINED, BROADCASTING, SUCCESS, FAILED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-10T12:29:15.538958Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-10T12:29:16.73835Z"
 *         errors:
 *           type: string
 *           nullable: true
 *           description: Error message if transaction failed
 *           example: null
 */

/**
 * @swagger
 * /api/transaction/{address}:
 *   get:
 *     summary: Get recent transaction history for a single address
 *     description: |
 *       Retrieve transaction history for address, with support for pagination.
 *       
 *       **Use Case**: 
 *       - Display Transaction List
 *       - Calculate Total Received
 *       - Multi-Address Portfolio History
 *       
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The address to fetch transaction history for
 *         example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *       - in: query
 *         name: fromScore
 *         required: false
 *         schema:
 *           type: number
 *         description: Starting score for pagination
 *         example: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of transactions to return
 *         example: 10
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: |
 *           Sort order by time:
 *           - `desc`: Newest first (most recent transactions)
 * 
 *           - `asc`: Oldest first (earliest transactions)
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
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
 *                       example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TransactionHistoryItem'
 *                     nextScore:
 *                       type: number
 *                       description: Use this value as `fromScore` for next page
 *                       example: 917512000001858
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
router.get('/:address', getRecentTxHistory);

/**
 * @swagger
 * /api/transaction/histories:
 *   post:
 *     summary: Get transaction histories for multiple addresses
 *     description: |
 *       Retrieves transaction histories for multiple addresses in a single call.
 *       
 *       **Use Case**: 
 *       - Monitor for New Transactions
 *       - Calculate Total Received
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addresses
 *             properties:
 *               addresses:
 *                 type: array
 *                 description: Array of address query configurations
 *                 minItems: 1
 *                 maxItems: 20
 *                 items:
 *                   type: object
 *                   required:
 *                     - address
 *                   properties:
 *                     address:
 *                       type: string
 *                       description: Wallet address to query
 *                     fromScore:
 *                       type: number
 *                       description: Pagination cursor (optional)
 *                     limit:
 *                       type: number
 *                       description: Number of transactions to return for this address
 *                       minimum: 1
 *                       maximum: 100
 *                       default: 10
 *                 example:
 *                   - address: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *                     fromScore: 0
 *                     limit: 10
 *                   - address: "1Gqwa5uPapTJqGEPZU6P7YZNGmWoZ6w9vk"
 *                     fromScore: 0
 *                     limit: 10

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
 *                        type: array
 *                        items:
 *                         $ref: '#/components/schemas/TransactionHistoryItem'
 *                       nextScore:
 *                         type: number
 *                         description: Use this value as `fromScore` for next page
 *                         example: 917512000001858
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
 *     description: |
 *       Retrieves the current status of an asynchronously submitted transaction.
 *       
 *       **When to use:**
 *       - After calling `/transfer`, `/transfer-multi`, or `/submit-rawtx`
 *       - To check if a transaction has been broadcast to the network
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticket ID returned from a transfer or submitRawTx operation
 *         example: "5d9dd4c1-8360-4d80-aa9d-96552a9bd9fa"
 *     responses:
 *       200:
 *         description: Status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TicketStatus'
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
router.get('/status/:ticketId', getTxStatus);

/**
 * @swagger
 * /api/transaction/transfer:
 *   post:
 *     summary: Transfer MNEE tokens using single input
 *     description: |
 *       Creates and optionally broadcasts MNEE token transfers.
 *       It handles UTXO selection, fee calculation, and cosigner authorization.
 *       
 *       **Process:**
 *       1. Submit transfer with WIF and recipient details
 *       2. Receive a ticketId in response if broadcast is true
 *       3. Receive txhex if broadcast is false
 * 
 *       **Note:**
 *       - When `broadcast: true` (transaction brodcasted directly, and ticketId is returned for tracking transactions.)
 *       - When `broadcast: false` (Returns the signed txHex, You can manually broadcast the transaction using /submit-rawtx endpoint.)
 * 
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wif
 *               - request
 *             properties:
 *               request:
 *                 type: array
 *                 description: List of transfer recipients
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/TransferRecipient'
 *               wif:
 *                 type: string
 *                 description: Wallet Import Format private key of the sender
 *                 example: "L1dRKo7sZZJijNyXbPTSJGc8DCVDcPLtsyhNSSVvcBrcTMDjnfuD"
 *               transferOptions:
 *                 $ref: '#/components/schemas/TransferOptions'
 *     responses:
 *       200:
 *         description: Transfer submitted successfully
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
 *                     ticketId:
 *                       type: string
 *                       example: "a81c0ad0-666e-4559-9655-55d2db0dd94e"
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
 *     summary: Transfer MNEE tokens from multiple source UTXOs (advanced)
 *     description: |
 *       This method enables advanced MNEE transfers using multiple source UTXOs with different private keys.
 *       This method provides full control over which UTXOs to spend and is essential for complex wallet operations like consolidation, HD wallet transfers, and multi-signature scenarios.
 *       
 *       **When to use:**
 *       - Basic Multi-Source Transfer
 *       - Spending specific UTXOs for accounting purposes
 *       
 *       **Requirements:**
 *       - You must know the exact UTXO details (txid, vout)
 *       - Each input needs its corresponding WIF key
 *       - Must specify a change address for leftover funds
 * 
 *       **Note:**
 *       - When `broadcast: true` (transaction brodcasted directly, and ticketId is returned for tracking transactions.)
 *       - When `broadcast: false` (Returns the signed txHex, You can manually broadcast the transaction using /submit-rawtx endpoint.)
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - options
 *             properties:
 *               options:
 *                 type: object
 *                 required:
 *                   - inputs
 *                   - recipients
 *                   - changeAddress
 *                 properties:
 *                   inputs:
 *                     type: array
 *                     description: Array of UTXOs to use as transaction inputs
 *                     minItems: 1
 *                     items:
 *                       type: object
 *                       required:
 *                         - txid
 *                         - vout
 *                         - wif
 *                       properties:
 *                         txid:
 *                           type: string
 *                           description: Transaction ID containing the UTXO (64-character hex string)
 *                           example: "21d50aec39cca0df132405340d8139217582791efcf48f56ceb93782dd6d8971"
 *                         vout:
 *                           type: number
 *                           description: Output index within the transaction
 *                           example: 2
 *                           minimum: 0
 *                         wif:
 *                           type: string
 *                           description: Private key (WIF format) that controls this UTXO
 *                           example: "L1dRKo7sZZJijNyXbPTSJGc8DCVDcPLtsyhNSSVvcBrcTMDjnfuD"
 *                   recipients:
 *                     type: array
 *                     description: Array of recipient addresses and amounts
 *                     minItems: 1
 *                     items:
 *                       type: object
 *                       required:
 *                         - address
 *                         - amount
 *                       properties:
 *                         address:
 *                           type: string
 *                           description: Recipient MNEE address
 *                           example: "1Gqwa5uPapTJqGEPZU6P7YZNGmWoZ6w9vk"
 *                         amount:
 *                           type: number
 *                           description: Amount of MNEE tokens to send
 *                           example: 0.001
 *                           minimum: 0.00001
 *                   changeAddress:
 *                     type: string
 *                     description: Address to receive any leftover funds after paying recipients and fees
 *                     example: "18kMmJ4F6uYPYuQ7o2C2GfsVKWu5fE9ska"
 *               transferOptions:
 *                 $ref: '#/components/schemas/TransferOptions'
 *     responses:
 *       200:
 *         description: Multi-input transfer submitted successfully
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
 *                     ticketId:
 *                       type: string
 *                       description: Unique identifier to track this transaction
 *                       example: "a81c0ad0-666e-4559-9655-55d2db0dd94e"
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
 *     summary: Submit a pre-built raw transaction hex (expert mode)
 *     description: |
 *       submits a pre-signed raw transaction to the MNEE network for asynchronous processing.
 *       This is useful when you have a transaction that was created offline, received from another service, or created with broadcast: false and need to broadcast it later.
 *       
 *       **When to use:**
 *       - Delayed Broadcasting
 *       - Transaction Queue System
 *       - Multi-Stage Approval Process
 *       
 *       **Requirements:**
 *       - Transaction must be properly signed
 *       - Must be valid MNEE transaction format
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
 *                 example: "0100000001..."
 *                 description: The raw transaction hex string to submit
 *               transferOptions:
 *                 $ref: '#/components/schemas/TransferOptions'
 *     responses:
  *       200:
 *         description: Transfer successful
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
 *                     ticketId:
 *                       type: string
 *                       description: Unique identifier to track this transaction
 *                       example: "a81c0ad0-666e-4559-9655-55d2db0dd94e"
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

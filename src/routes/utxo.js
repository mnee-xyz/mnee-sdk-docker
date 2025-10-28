import express from "express";
import { getUtxos, getEnoughUtxos, getAllUtxos } from "../controllers/utxoController.js";
import { validateQueryParams } from "../middleware/validateQueryParams.js";

const router = express.Router({caseSensitive: true});

/**
 * @swagger
 * components:
 *   schemas:
 *     BSV21Data:
 *       type: object
 *       description: BSV-21 token metadata (if UTXO contains tokens)
 *       properties:
 *         dec:
 *           type: number
 *           description: Number of decimal places (5 for MNEE)
 *           example: 5
 *         amt:
 *           type: number
 *           description: The amount of MNEE tokens in atomic units (100,000 = 1 MNEE)
 *           example: 10000
 *         id:
 *           type: string
 *           description: The token ID
 *           example: "833a7720966a2a435db28d967385e8aa7284b6150ebb39482cc5228b73e1703f_0"
 *         op:
 *           type: string
 *           description: Token operation type
 *           example: "transfer"
 *           enum: [transfer, mint, burn, redeem, deploy]
 *         sym:
 *           type: string
 *           description: Token symbol
 *           example: "MNEE"
 *         icon:
 *           type: string
 *           description: The icon address for the token
 *           example: "9c7f7f1788c6382d5ac737a4052334cf150b52d1e46c484ecfb1d6e00184f263_0"
 *     CosignData:
 *       type: object
 *       description: Cosigner approval data (if UTXO requires cosigning)
 *       properties:
 *         address:
 *           type: string
 *           description: The cosigner address for this UTXO
 *           example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *         cosigner:
 *           type: string
 *           description: The cosigner public key
 *           example: "02bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6c"
 *     UTXO:
 *       type: object
 *       description: Unspent Transaction Output - spendable funds
 *       properties:
 *         satoshis:
 *           type: number
 *           description: Amount in satoshis (smallest Bitcoin unit, 1 BTC = 100,000,000 satoshis)
 *           example: 1
 *         height:
 *           type: number
 *           description: Block height where this UTXO was created
 *           example: 913766
 *         idx:
 *           type: number
 *           description: The output index within the transaction
 *           example: 4827
 *         score:
 *           type: number
 *           description: Priority score for UTXO selection (higher = preferred)
 *           example: 913766000004827
 *         vout:
 *           type: number
 *           description: Output index in the transaction
 *           example: 0
 *         outpoint:
 *           type: string
 *           description: UTXO identifier (txid:vout)
 *           example: "80ccf73fa3b3cbf61412b2d26c710616250369d9fd15394c87b556a58663cd6e_0"
 *         script:
 *           type: string
 *           description: Locking script
 *           example: "AGMDb3JkURJhcHBsaWNhdGlvbi9ic3YtMjAATHZ7InAiOiJic3YtMjAiLCJvcCI6InRyYW5zZmVyIiwiaWQiOiI4MzNhNzcyMDk2NmEyYTQzNWRiMjhkOTY3Mzg1ZThhYTcyODRiNjE1MGViYjM5NDgyY2M1MjI4YjczZTE3MDNmXzAiLCJhbXQiOiIxMDAwMCJ9aHapFAqfxgjFkcQOMx1C+41bN6wb+IimiK0hAr7TXolMxBzJh5tAAq0D0zUzthXBtHYGjI3WgioJ+T9srA=="
 *         txid:
 *           type: string
 *           description: Transaction ID where this UTXO was created
 *           example: "80ccf73fa3b3cbf61412b2d26c710616250369d9fd15394c87b556a58663cd6e"
 *         data:
 *           type: object
 *           description: Additional metadata for special UTXOs (tokens, cosigning)
 *           properties:
 *             bsv21:
 *               $ref: '#/components/schemas/BSV21Data'
 *             cosign:
 *               $ref: '#/components/schemas/CosignData'
 *         owners:
 *           type: array
 *           description: Addresses that own this UTXO (can spend it)
 *           items:
 *             type: string
 *           example: ["1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"]
 *         senders:
 *           type: array
 *           description: Addresses that sent funds to create this UTXO
 *           items:
 *             type: string
 *           example: ["1Gqwa5uPapTJqGEPZU6P7YZNGmWoZ6w9vk"]
 */

/**
 * @swagger
 * /api/utxos/paginated/{address}:
 *   get:
 *     summary: Get paginated UTXOs for efficient data browsing
 *     description: |
 *       Retrieves the Unspent Transaction Outputs (UTXOs) for one or more MNEE addresses. 
 *       UTXOs represent the spendable MNEE tokens associated with an address and are essential for constructing new transactions.
 *       
 *       **Use Case**: 
 *       - Calculate Total Spendable Balance
 *       - Get All UTXOs with Pagination
 *     tags:
 *       - UTXO
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Bitcoin address to retrieve UTXOs for
 *         example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (starts from 1)
 *         example: 1
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of UTXOs per page (max 100 recommended for performance)
 *         example: 10
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: |
 *           Sort order by UTXO value:
 *           - `asc`: Smallest UTXOs first (good for spending dust)
 * 
 *           - `desc`: Largest UTXOs first (good for finding big coins)
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Paginated UTXOs retrieved successfully
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
 *                     $ref: '#/components/schemas/UTXO'
 *       500:
 *         description: internal server error
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
router.get("/paginated/:address", validateQueryParams(['page', 'size', 'order']), getUtxos);

/**
 * @swagger
 * /api/utxos/{address}/enough:
 *   get:
 *     summary: Get just enough UTXOs to cover a target amount
 *     description: |
 *       Retrieves just enough Unspent Transaction Outputs (UTXOs) for a MNEE address to cover a specified token amount.
 *       This method is optimized for transfer operations, as it stops fetching UTXOs once the required amount is reached, making it more efficient than fetching all UTXOs.
 *       
 *       **Use Case**: 
 *       - Pre-transfer Validation
 *       - UTXO Selection
 *       - Balance Verification
 *       
 *     tags:
 *       - UTXO
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Bitcoin address to retrieve UTXOs for
 *         example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *           minimum: 1
 *         description: The required amount in atomic units (1 MNEE = 100,000 atomic units)
 *         example: 1000
 *     responses:
 *       200:
 *         description: Sufficient UTXOs found and returned
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
 *                     $ref: '#/components/schemas/UTXO'
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
router.get("/:address/enough", validateQueryParams(['amount']), getEnoughUtxos);
/**
 * @swagger
 * /api/utxos/{address}/all:
 *   get:
 *     summary: Get all UTXOs for a given address
 *     description: |
 *       Retrieves all Unspent Transaction Outputs (UTXOs) for a MNEE address. 
 *       This method fetches every UTXO associated with the address by automatically paginating through all available results, making it ideal for comprehensive balance calculations and wallet management operations.
 *       
 *       **Use Case**: 
 *       - Audit Operations
 *       - UTXO Management
 *       - Wallet Display
 *     tags:
 *       - UTXO
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Bitcoin address to retrieve UTXOs for
 *         example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *     responses:
 *       200:
 *         description: List of all UTXOs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                  type: array
 *                  items:
 *                     $ref: '#/components/schemas/UTXO'
 *                   
 *       500:
 *         description: internal server error
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

router.get("/:address/all", getAllUtxos);

export default router

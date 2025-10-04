import express from "express";
import { getUtxos, getEnoughUtxos, getAllUtxos } from "../controllers/utxoController.js";

const router = express.Router();

/**
 * @swagger
 * /api/utxos/{address}:
 *   get:
 *     summary: Get paginated UTXOs for a given address
 *     tags:
 *       - UTXO
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address to get UTXOs for
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of UTXOs per page
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order of UTXOs
 *     responses:
 *       200:
 *         description: List of paginated UTXOs
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
 *                       satoshis:
 *                         type: number
 *                         example: 0
 *                       height:
 *                         type: number
 *                         example: 0
 *                       idx:
 *                         type: number
 *                         example: 0
 *                       score:
 *                         type: number
 *                         example: 0
 *                       vout:
 *                         type: number
 *                         example: 0
 *                       outpoint:
 *                         type: string
 *                         example: "string"
 *                       script:
 *                         type: string
 *                       txid:
 *                         type: string
 *                       data:
 *                         type: object
 *                         properties:
 *                           bsv21:
 *                             type: object
 *                             properties:
 *                               dec:
 *                                 type: number
 *                               amt:
 *                                 type: number
 *                               id:
 *                                 type: string
 *                               op:
 *                                 type: string
 *                               sym:
 *                                 type: string
 *                               icon:
 *                                 type: string
 *                           cosign:
 *                             type: object
 *                             properties:
 *                               address:
 *                                 type: string
 *                               cosigner:
 *                                 type: string
 *                       owners:
 *                         type: array
 *                         items:
 *                           type: string
 *                       senders:
 *                         type: array
 *                         items:
 *                           type: string
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
 *                   example: "Invalid Bitcoin address: string"
 */
router.get("/:address", getUtxos);

/**
 * @swagger
 * /api/utxos/{address}/enough:
 *   get:
 *     summary: Get enough UTXOs for a given address to cover the specified amount
 *     tags:
 *       - UTXO
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address to get UTXOs from
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *         description: The target amount (in atomic units or decimal) to cover
 *     responses:
 *       200:
 *         description: UTXOs sufficient to cover the amount
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
 *                       satoshis:
 *                         type: number
 *                         example: 0
 *                       height:
 *                         type: number
 *                         example: 0
 *                       idx:
 *                         type: number
 *                         example: 0
 *                       score:
 *                         type: number
 *                         example: 0
 *                       vout:
 *                         type: number
 *                         example: 0
 *                       outpoint:
 *                         type: string
 *                         example: "string"
 *                       script:
 *                         type: string
 *                       txid:
 *                         type: string
 *                       data:
 *                         type: object
 *                         properties:
 *                           bsv21:
 *                             type: object
 *                             properties:
 *                               dec:
 *                                 type: number
 *                               amt:
 *                                 type: number
 *                               id:
 *                                 type: string
 *                               op:
 *                                 type: string
 *                               sym:
 *                                 type: string
 *                               icon:
 *                                 type: string
 *                           cosign:
 *                             type: object
 *                             properties:
 *                               address:
 *                                 type: string
 *                               cosigner:
 *                                 type: string
 *                       owners:
 *                         type: array
 *                         items:
 *                           type: string
 *                       senders:
 *                         type: array
 *                         items:
 *                           type: string
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
 *                   example: "Insufficient MNEE balance. Max transfer amount: 0"
 */
router.get("/:address/enough", getEnoughUtxos);
/**
 * @swagger
 * /api/utxos/{address}/all:
 *   get:
 *     summary: Get all UTXOs for a given address
 *     tags:
 *       - UTXO
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address to get all UTXOs for
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       satoshis:
 *                         type: number
 *                       height:
 *                         type: number
 *                       idx:
 *                         type: number
 *                       score:
 *                         type: number
 *                       vout:
 *                         type: number
 *                       outpoint:
 *                         type: string
 *                       script:
 *                         type: string
 *                       txid:
 *                         type: string
 *                       data:
 *                         type: object
 *                         properties:
 *                           bsv21:
 *                             type: object
 *                             properties:
 *                               dec:
 *                                 type: number
 *                               amt:
 *                                 type: number
 *                               id:
 *                                 type: string
 *                               op:
 *                                 type: string
 *                               sym:
 *                                 type: string
 *                               icon:
 *                                 type: string
 *                           cosign:
 *                             type: object
 *                             properties:
 *                               address:
 *                                 type: string
 *                               cosigner:
 *                                 type: string
 *                       owners:
 *                         type: array
 *                         items:
 *                           type: string
 *                       senders:
 *                         type: array
 *                         items:
 *                           type: string
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
 *                   example: "Invalid Bitcoin address: string"
 */

router.get("/:address/all", getAllUtxos);

export default router

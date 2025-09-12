import express from "express";
import { getUtxos, getEnoughUtxos, getAllUtxos } from "../controllers/utxoController.js";

const router = express.Router();

// GET paginated UTXOs: /api/utxos/:address?page=1&size=10&order=asc
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
 *                 utxos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       txid:
 *                         type: string
 *                       vout:
 *                         type: integer
 *                       amount:
 *                         type: number
 *       400:
 *         description: Invalid address or query params
 */
router.get("/:address", getUtxos);

// GET enough UTXOs to cover amount: /api/utxos/:address/enough?amount=10000
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
 *                 utxos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       txid:
 *                         type: string
 *                       vout:
 *                         type: integer
 *                       amount:
 *                         type: number
 *       400:
 *         description: Missing amount parameter or invalid address
 */
router.get("/:address/enough", getEnoughUtxos);

// GET all UTXOs: /api/utxos/:address/all
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
 *                 utxos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       txid:
 *                         type: string
 *                       vout:
 *                         type: integer
 *                       amount:
 *                         type: number
 *       400:
 *         description: Invalid address supplied
 */

router.get("/:address/all", getAllUtxos);

export default router

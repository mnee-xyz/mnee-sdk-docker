import express from 'express';
import {
  parseTx,
  parseTxFromRaw,
  parseInscription,
  parseCosignerScripts
} from '../controllers/parseController.js'

const router = express.Router();

/**
 * @swagger
 * /api/parse/{txid}:
 *   get:
 *     summary: Parse transaction by txid
 *     tags:
 *       - Parse
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID to parse
 *       - in: query
 *         name: includeRaw
 *         schema:
 *           type: boolean
 *         description: Whether to include raw transaction data
 *     responses:
 *       200:
 *         description: Successfully parsed transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid txid or parameters
 */
router.get('/:txid', parseTx);

/**
 * @swagger
 * /api/parse/from-raw:
 *   post:
 *     summary: Parse transaction from rawTxHex
 *     tags:
 *       - Parse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rawTxHex:
 *                 type: string
 *                 example: "your TxHex"
 *               includeRaw:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully parsed raw transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid input data
 */
router.post('/from-raw', parseTxFromRaw);

/**
 * @swagger
 * /api/parse/inscription:
 *   post:
 *     summary: Parse inscription from script
 *     tags:
 *       - Parse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               script:
 *                 type: string
 *                 example: "your-script-string"
 *     responses:
 *       200:
 *         description: Successfully parsed inscription
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid input data
 */
router.post('/inscription', parseInscription);

/**
 * @swagger
 * /api/parse/cosigner-scripts:
 *   post:
 *     summary: Parse cosigner scripts
 *     tags:
 *       - Parse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scripts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["script1", "script2"]
 *     responses:
 *       200:
 *         description: Successfully parsed cosigner scripts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid input data
 */
router.post('/cosigner-scripts', parseCosignerScripts);

export default router;

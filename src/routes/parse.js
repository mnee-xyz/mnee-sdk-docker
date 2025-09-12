import express from 'express';
import {
  parseTx,
  parseTxFromRaw,
  parseInscription,
  parseCosignerScripts,
  generateHDWallet
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

/**
 * @swagger
 * /api/parse/hdwallet:
 *   post:
 *     summary: Generate HD Wallet
 *     tags:
 *       - Parse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mnemonic:
 *                 type: string
 *                 example: "your custom mnemonic code"
 *               options:
 *                 type: object
 *                 properties:
 *                   derivationPath:
 *                     type: string
 *                     example: "m/44'/236'/0'"
 *                   cacheSize:
 *                     type: number
 *                     example: 1000
 *                   network:
 *                     type: string
 *                     example: "mainnet"
 *     responses:
 *       200:
 *         description: Successfully generated HD Wallet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid input data
 */
router.post('/hdwallet', generateHDWallet);

export default router;

import express from 'express';
import {
  parseTx,
  parseTxFromRaw,
  parseInscription,
  parseCosignerScripts
} from '../controllers/parseController.js'

const router = express.Router({caseSensitive: true});

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
 *           example: false
 *         description: Whether to include raw transaction data (true = include, false = exclude)
 *     responses:
 *       200:
 *         description: Successfully parsed transaction (includeRaw=false)
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
 *                     txid:
 *                       type: string
 *                       example: "string"
 *                     environment:
 *                       type: string
 *                       example: "string"
 *                     type:
 *                       type: string
 *                       example: "transfer"
 *                     inputs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           address:
 *                             type: string
 *                             example: "string"
 *                           amount:
 *                             type: number
 *                             example: 0
 *                     outputs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           address:
 *                             type: string
 *                             example: "string"
 *                           amount:
 *                             type: number
 *                             example: 0
 *                     isValid:
 *                       type: boolean
 *                       example: true
 *                     inputTotal:
 *                       type: string
 *                       example: "0"
 *                     outputTotal:
 *                       type: string
 *                       example: "0"
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
 *                 example: false
 *     responses:
 *       200:
 *         description: Successfully parsed raw transaction
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
 *                     txid:
 *                       type: string
 *                       example: "string"
 *                     environment:
 *                       type: string
 *                       example: "string"
 *                     type:
 *                       type: string
 *                       example: "transfer"
 *                     inputs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           address:
 *                             type: string
 *                             example: "string"
 *                           amount:
 *                             type: number
 *                             example: 0
 *                     outputs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           address:
 *                             type: string
 *                             example: "string"
 *                           amount:
 *                             type: number
 *                             example: 0
 *                     isValid:
 *                       type: boolean
 *                       example: true
 *                     inputTotal:
 *                       type: string
 *                       example: "0"
 *                     outputTotal:
 *                       type: string
 *                       example: "0"
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
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     file:
 *                       type: object
 *                       properties:
 *                         hash:
 *                           type: string
 *                           example: "string"
 *                         size:
 *                           type: integer
 *                           example: 0
 *                         type:
 *                           type: string
 *                           example: "application/bsv-20"
 *                         content:
 *                           type: array
 *                           items:
 *                             type: integer
 *                           description: Byte array of file content
 *                     fields:
 *                       type: object
 *                       example: {}
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
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   example: []
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
router.post('/cosigner-scripts', parseCosignerScripts);

export default router;

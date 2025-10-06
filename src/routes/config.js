import express from 'express';
import {
  getConfig,
  validateMneeTx,
  toAtomicAmount,
  fromAtomicAmount
} from '../controllers/configController.js';

const router = express.Router();

/**
 * @swagger
 * /api/config:
 *   get:
 *     summary: Get MNEE configuration
 *     tags:
 *       - Config
 *     responses:
 *       200:
 *         description: Successfully retrieved MNEE configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     approver:
 *                       type: string
 *                     feeAddress:
 *                       type: string
 *                     burnAddress:
 *                       type: string
 *                     mintAddress:
 *                       type: string
 *                     fees:
 *                       type: array
 *                     decimals:
 *                       type: number
 *                     tokenId:
 *                       type: string
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
router.get('/', getConfig);

/**
 * @swagger
 * /api/config/validate:
 *   post:
 *     summary: Validate MNEE transaction
 *     tags:
 *       - Config
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
 *               request:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                     amount:
 *                       type: number
 *                 description: Optional - validate against specific transfer details
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
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
router.post('/validate', validateMneeTx);

/**
 * @swagger
 * /api/config/to-atomic:
 *   post:
 *     summary: Convert amount to atomic units
 *     tags:
 *       - Config
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 0
 *                 description: Decimal amount to convert
 *     responses:
 *       200:
 *         description: Converted atomic amount
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
 *                     atomicAmount:
 *                       type: number
 *                       example: 0
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
 *                 error:
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
router.post('/to-atomic', toAtomicAmount);

/**
 * @swagger
 * /api/config/from-atomic:
 *   post:
 *     summary: Convert atomic units to decimal amount
 *     tags:
 *       - Config
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               atomicAmount:
 *                 type: number
 *                 example: 0
 *                 description: Atomic amount to convert
 *     responses:
 *       200:
 *         description: Converted decimal amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                       example: 0
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
 *                 error:
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
router.post('/from-atomic', fromAtomicAmount);

export default router;

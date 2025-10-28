import express from 'express';
import {
  getConfig,
  validateMneeTx,
  toAtomicAmount,
  fromAtomicAmount
} from '../controllers/configController.js';

const router = express.Router({caseSensitive: true});

/**
 * @swagger
 * components:
 *   schemas:
 *     ConfigResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates the request was successful
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             decimals:
 *               type: number
 *               description: Number of decimal places for MNEE (5 decimals = 100,000 atomic units per MNEE)
 *               example: 5
 *             approver:
 *               type: string
 *               description: The public key of the MNEE approver/cosigner service
 *               example: "02bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6c"
 *             feeAddress:
 *               type: string
 *               description: The address where transaction fees are sent
 *               example: "1H9wgHCTHjmgBw4PAbQ4PQBQhGFrHWhjbU"
 *             burnAddress:
 *               type: string
 *               description: The address used for burning MNEE tokens
 *               example: "1HNuPi9Y7nMV6x8crJ6DnD1wJtkLym8EFE"
 *             mintAddress:
 *               type: string
 *               description: The address used for minting new MNEE tokens
 *               example: "1AZNdbFYBDFTAEgzZMfPzANxyNrpGJZAUY"
 *             tokenId:
 *               type: string
 *               description: The token identifier (includes token hash and index)
 *               example: "833a7720966a2a435db28d967385e8aa7284b6150ebb39482cc5228b73e1703f_0"
 *             fees:
 *               type: array
 *               description: Array of fee tiers based on transaction amount
 *               items:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     description: Minimum amount for this fee tier (in atomic units)
 *                   max:
 *                     type: number
 *                     description: Maximum amount for this fee tier (in atomic units)
 *                   fee:
 *                     type: number
 *                     description: Fee amount for this tier (in atomic units)
 *               example:
 *                 - min: 0
 *                   max: 1000000
 *                   fee: 100
 *                 - min: 1000001
 *                   max: 9007199254740991
 *                   fee: 1000

 *               
 *     TransferRequest:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           description: 
 *           example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *         amount:
 *           type: number
 *           description: Amount to transfer in decimal units
 *           example: 0.399
 */

/**
 * @swagger
 * /api/config:
 *   get:
 *     summary: Get MNEE token configuration
 *     description: |
 *       Retrieves the current configuration for the MNEE service.
 *       This configuration includes essential parameters such as the token ID, current fees, and other settings required for interacting with the MNEE network.
 *       
 *     tags:
 *       - Config
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfigResponse'
 *             example:
 *                   success: true
 *                   data:
 *                     decimals: 5
 *                     approver: "02bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6c"
 *                     feeAddress: "1H9wgHCTHjmgBw4PAbQ4PQBQhGFrHWhjbU"
 *                     burnAddress: "1HNuPi9Y7nMV6x8crJ6DnD1wJtkLym8EFE"
 *                     mintAddress: "1AZNdbFYBDFTAEgzZMfPzANxyNrpGJZAUY"
 *                     tokenId: "833a7720966a2a435db28d967385e8aa7284b6150ebb39482cc5228b73e1703f_0"
 *                     fees:
 *                       - min: 0
 *                         max: 1000000
 *                         fee: 100
 *                       - min: 1000001
 *                         max: 9007199254740991
 *                         fee: 1000
 *                    
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
 *     summary: Validate a MNEE transaction
 *     description: |
 *       Validates MNEE transactions to ensure they are properly formatted and authorized by the cosigner.
 *       It supports both basic validation (checking if the transaction is well-formed) and deep validation (verifying against expected outputs).
 *       
 *       **Basic Validation (always performed)**:
 *       - Transaction hex is valid and can be decoded
 *       - Cosigner signature is present and valid
 * 
 *       **Deep Validation (if request array provided)**:
 *       - All specified recipients are present in outputs
 *       - Total output amounts are correct
 *       - Amount given in decimal values only
 *       
 *     tags:
 *       - Config
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rawTxHex
 *             properties:
 *               rawTxHex:
 *                 type: string
 *                 description: Raw transaction in hexadecimal format
 *                 example: "01000000025f717215b5a9025b7982013c07ddf5f17e0ac176a222f09254845a3702bacd5a00000000b247304402206beb76962229c1552c40a981e957380bf915fda3abf8586c9b2d890adf2a817102206a4c6bac023a5b92ce89606958c9bea315bb90f2243e7a7ea9bdc9ebe95ee005c147304402201e3a7b3dc767840f7654dfdcc708a2b8360fd00f5e2709a8e728ebd715827b4802200aff57603ea896a8d3a4aad2381fe9c6c2d361f58884db62417496515ebf1d8dc12102afce1e4a06a2136dbe5ae4aca13f39b093b569719d9a245fe49de7f194b84c79ffffffff9234f5e13e1149f7d7956c655fcc6fe7300bb556aca88b4b92540d3e684b8bba070000006b483045022100c333d0fb4e0a13b5743bdb45d655a8fb052d2060114d867a7fa2dafb8a4eafc402201cca11cd1ae18530f94b976ca1a868b1a561e896c502b51c49674df1b7d4f84941210255811f4cee0f4432fbd4e5f5339d932dfcc3ddc638652e9236328e7b8ff96e66ffffffff030100000000000000d00063036f726451126170706c69636174696f6e2f6273762d3230004c767b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a223330303030227d6876a914adcb67f0c6ba7af45eff26e32032c08610a77ca088ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac0100000000000000ce0063036f726451126170706c69636174696f6e2f6273762d3230004c747b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a22313030227d6876a914b132fb8440e2d45b60d50ce8680aa9d0d316ab7288ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac0100000000000000d00063036f726451126170706c69636174696f6e2f6273762d3230004c767b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a223339393030227d6876a9140a9fc608c591c40e331d42fb8d5b37ac1bf888a688ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac00000000"
 *               request:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TransferRequest'
 *                 description: Optional - Array of expected transfers to validate against, If provided.
 *                 example:
 *                   - address: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *                     amount: 0.399
 *                   - address: "1Gqwa5uPapTJqGEPZU6P7YZNGmWoZ6w9vk"
 *                     amount: 0.3
 *           examples:
 *             basicValidation:
 *               summary: Basic validation (always performed)
 *               value:
 *                 rawTxHex: "01000000025f717215b5a9025b7982013c07ddf5f17e0ac176a222f09254845a3702bacd5a00000000b247304402206beb76962229c1552c40a981e957380bf915fda3abf8586c9b2d890adf2a817102206a4c6bac023a5b92ce89606958c9bea315bb90f2243e7a7ea9bdc9ebe95ee005c147304402201e3a7b3dc767840f7654dfdcc708a2b8360fd00f5e2709a8e728ebd715827b4802200aff57603ea896a8d3a4aad2381fe9c6c2d361f58884db62417496515ebf1d8dc12102afce1e4a06a2136dbe5ae4aca13f39b093b569719d9a245fe49de7f194b84c79ffffffff9234f5e13e1149f7d7956c655fcc6fe7300bb556aca88b4b92540d3e684b8bba070000006b483045022100c333d0fb4e0a13b5743bdb45d655a8fb052d2060114d867a7fa2dafb8a4eafc402201cca11cd1ae18530f94b976ca1a868b1a561e896c502b51c49674df1b7d4f84941210255811f4cee0f4432fbd4e5f5339d932dfcc3ddc638652e9236328e7b8ff96e66ffffffff030100000000000000d00063036f726451126170706c69636174696f6e2f6273762d3230004c767b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a223330303030227d6876a914adcb67f0c6ba7af45eff26e32032c08610a77ca088ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac0100000000000000ce0063036f726451126170706c69636174696f6e2f6273762d3230004c747b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a22313030227d6876a914b132fb8440e2d45b60d50ce8680aa9d0d316ab7288ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac0100000000000000d00063036f726451126170706c69636174696f6e2f6273762d3230004c767b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a223339393030227d6876a9140a9fc608c591c40e331d42fb8d5b37ac1bf888a688ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac00000000"
 *             withTransferValidation:
 *               summary: Deep validation (with request)
 *               value:
 *                 rawTxHex: "01000000025f717215b5a9025b7982013c07ddf5f17e0ac176a222f09254845a3702bacd5a00000000b247304402206beb76962229c1552c40a981e957380bf915fda3abf8586c9b2d890adf2a817102206a4c6bac023a5b92ce89606958c9bea315bb90f2243e7a7ea9bdc9ebe95ee005c147304402201e3a7b3dc767840f7654dfdcc708a2b8360fd00f5e2709a8e728ebd715827b4802200aff57603ea896a8d3a4aad2381fe9c6c2d361f58884db62417496515ebf1d8dc12102afce1e4a06a2136dbe5ae4aca13f39b093b569719d9a245fe49de7f194b84c79ffffffff9234f5e13e1149f7d7956c655fcc6fe7300bb556aca88b4b92540d3e684b8bba070000006b483045022100c333d0fb4e0a13b5743bdb45d655a8fb052d2060114d867a7fa2dafb8a4eafc402201cca11cd1ae18530f94b976ca1a868b1a561e896c502b51c49674df1b7d4f84941210255811f4cee0f4432fbd4e5f5339d932dfcc3ddc638652e9236328e7b8ff96e66ffffffff030100000000000000d00063036f726451126170706c69636174696f6e2f6273762d3230004c767b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a223330303030227d6876a914adcb67f0c6ba7af45eff26e32032c08610a77ca088ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac0100000000000000ce0063036f726451126170706c69636174696f6e2f6273762d3230004c747b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a22313030227d6876a914b132fb8440e2d45b60d50ce8680aa9d0d316ab7288ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac0100000000000000d00063036f726451126170706c69636174696f6e2f6273762d3230004c767b2270223a226273762d3230222c226f70223a227472616e73666572222c226964223a22383333613737323039363661326134333564623238643936373338356538616137323834623631353065626233393438326363353232386237336531373033665f30222c22616d74223a223339393030227d6876a9140a9fc608c591c40e331d42fb8d5b37ac1bf888a688ad2102bed35e894cc41cc9879b4002ad03d33533b615c1b476068c8dd6822a09f93f6cac00000000"
 *                 request:
 *                   - address: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *                     amount: 0.399
 *     responses:
 *       200:
 *         description: Validation successful
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
 *                     isValid:
 *                       type: boolean
 *                       description: True if transaction passes all validation checks
 *                       example: true
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
 *     summary: Converts a human-readable MNEE amount to atomic units.
 *     description: |
 *       Converts a decimal MNEE amount (like 1.5 MNEE) to atomic units (like 150000).
 *       Uses the token's decimal configuration (typically 5 decimals for MNEE).
 *       
 *       **Example Conversion** (assuming 5 decimals):
 *       - Input: 1.5 MNEE → Output: 150000 atomic units
 *       - Input: 0.00001 MNEE → Output: 1 atomic unit
 *       - Input: 100 MNEE → Output: 10000000 atomic units
 *     tags:
 *       - Config
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Decimal amount to convert (human-readable MNEE)
 *                 example: 1.5
 *           example:
 *                 amount: 1.5
 *     responses:
 *       200:
 *         description: Amount converted successfully
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
 *                       type: integer
 *                       description: Amount in smallest indivisible units (integer)
 *                       example: 150000
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
router.post('/to-atomic', toAtomicAmount);

/**
 * @swagger
 * /api/config/from-atomic:
 *   post:
 *     summary: Converts atomic units to human-readable MNEE amount.
 *     description: |
 *       Converts atomic units (like 150000) to decimal MNEE amount (like 1.5 MNEE).
 *       Uses the token's decimal configuration (typically 5 decimals for MNEE).
 *       
 *       **Example Conversion** (assuming 5 decimals):
 *       - Input: 150000 atomic units → Output: 1.5 MNEE
 *       - Input: 1 atomic unit → Output: 0.00001 MNEE
 *       - Input: 10000000 atomic units → Output: 100 MNEE
 *       
 *     tags:
 *       - Config
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - atomicAmount
 *             properties:
 *               atomicAmount:
 *                 type: integer
 *                 description: Amount in atomic units (smallest indivisible units)
 *                 example: 150000
 *     responses:
 *       200:
 *         description: Amount converted successfully
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
 *                     amount:
 *                       type: number
 *                       description: Human-readable amount in MNEE
 *                       example: 1.5
 *             example:
 *                   success: true
 *                   data:
 *                     amount: 1.5
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
router.post('/from-atomic', fromAtomicAmount);

export default router;

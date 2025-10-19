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
 * components:
 *   schemas:
 *     TransactionInput:
 *       type: object
 *       properties:
 *         address: 
 *           type: string
 *           description: Input address
 *           example: "1yBABUjr1ZNMVDTAshyqmdYg1fRLig3gQ"
 *         amount:
 *            type: integer
 *            description: Amount from this input
 *            example: 70000 
 *     TransactionOutput:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           description: Output address
 *           example: "1Gqwa5uPapTJqGEPZU6P7YZNGmWoZ6w9vk"
 *         amount:
 *           type: integer
 *           description: Amount to this output
 *           example: 30000
 *     ParsedTransaction:
 *       type: object
 *       properties:
 *         txid:
 *           type: string
 *           description: transaction ID
 *           example: "05a8d8a4cbf7e762c1a18ac755321d793b9345b73045c9d920c6d08abf06b1fc"
 *         environment:
 *           type: string
 *           description: Network environment (sandbox, production)
 *           example: "sandbox"
 *         type:
 *           type: string
 *           description: Transaction type
 *           example: "transfer"
 *           enum: [transfer, mint, burn, deploy, redeem]
 *         inputs:
 *           type: array
 *           description: List of transaction inputs (sources of funds)
 *           items:
 *             $ref: '#/components/schemas/TransactionInput'
 *         outputs:
 *           type: array
 *           description: List of transaction outputs (destinations of funds)
 *           items:
 *             $ref: '#/components/schemas/TransactionOutput'
 *         isValid:
 *           type: boolean
 *           description: Whether transaction meets MNEE protocol requirements
 *           example: true
 *         inputTotal:
 *           type: string
 *           description: Total amount from all inputs
 *           example: "70000"
 *         outputTotal:
 *           type: string
 *           description: Total amount to all outputs
 *           example: "30000"
 *     InscriptionFile:
 *       type: object
 *       properties:
 *         hash:
 *           type: string
 *           description: Content hash of the inscribed file
 *           example: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
 *         size:
 *           type: integer
 *           description: File size in bytes
 *           example: 1024
 *         type:
 *           type: string
 *           description: MIME type or inscription protocol
 *           example: "application/bsv-20"
 *         content:
 *           type: array
 *           items:
 *             type: integer
 *           description: Raw file content as byte array (can be converted to Buffer)
 *           example: [123, 34, 112, 34, 58, 34, 98, 115, 118, 45, 50, 48, 34, 125]
 *     CosignerScript:
 *       type: object
 *       properties:
 *         publicKey:
 *           type: string
 *           description: Public key of the cosigner
 *           example: "02b4632d08485ff1df2db55b9dafd23347d1c47a457072a1e87be26896549a8737"
 *         signature:
 *           type: string
 *           description: Signature from the cosigner (if present)
 *           example: "3045022100..."
 *         address:
 *           type: string
 *           description: Address derived from the public key
 *           example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
 */

/**
 * @swagger
 * /api/parse/{txid}:
 *   get:
 *     summary: parse and analyze MNEE transactions, by txid
 *     description: |
 *       Extracting detailed information about inputs, outputs, and validation status.
 *       
 *       **What you'll get**:
 *       - Transaction type (transfer, mint, burn, etc.)
 *       - All input addresses and amounts (who sent)
 *       - All output addresses and amounts (who received)
 *       
 *       **Testing Tips**:
 *       - Use `includeRaw=false` (default) for cleaner output
 * 
 *       - Set `includeRaw=true` to get raw hex for debugging
 *     tags:
 *       - Parse
 *     parameters:
 *       - in: path
 *         name: txid
 *         required: true
 *         schema:
 *           type: string
 *         description: transaction ID to parse
 *         example: "05a8d8a4cbf7e762c1a18ac755321d793b9345b73045c9d920c6d08abf06b1fc"
 *       - in: query
 *         name: includeRaw
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include raw transaction hex in response (increases response size significantly)
 *         example: false
 *     responses:
 *       200:
 *         description: Transaction parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ParsedTransaction'
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
router.get('/:txid', parseTx);

/**
 * @swagger
 * /api/parse/from-raw:
 *   post:
 *     summary: Parse transaction from raw hexadecimal data
 *     description: |
 *       parses a transaction from its raw hexadecimal representation.
 *       
 *       **Use Case**: 
 *       - Validate and preview transaction structure before broadcasting
 *       
 *     tags:
 *       - Parse
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
 *               includeRaw:
 *                 type: boolean
 *                 description: Echo back the raw transaction hex in response
 *                 default: false
 *                 example: false
 *     responses:
 *       200:
 *         description: Raw transaction parsed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ParsedTransaction'
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
router.post('/from-raw', parseTxFromRaw);

/**
 * @swagger
 * /api/parse/inscription:
 *   post:
 *     summary: Parse inscription data from Bitcoin script
 *     description: |
 *       Extracts inscription data from a Bitcoin script.
 *       This is useful for analyzing on-chain data and understanding transaction metadata.
 *       
 *     tags:
 *       - Parse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - script
 *             properties:
 *               script:
 *                 type: string
 *                 description: Hexadecimal Bitcoin script
 *                 example: "6a4c507b2270223a226273762d3230222c226f70223a226465706c6f79222c227469636b223a226d6e6565222c226d6178223a223231303030303030222c226c696d223a2231303030227d"
 *     responses:
 *       200:
 *         description: Inscription parsed successfully
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
 *                       $ref: '#/components/schemas/InscriptionFile'
 *                     fields:
 *                       type: object
 *                       description: Parsed fields from inscriptions
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

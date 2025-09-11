import express from 'express';
import {
  parseTx,
  parseTxFromRaw,
  parseInscription,
  parseCosignerScripts,
  generateHDWallet
} from '../controllers/parseController.js'

const router = express.Router();

// Parse transaction by txid
router.get('/:txid', parseTx);

// Parse transaction from rawTxHex
router.post('/from-raw', parseTxFromRaw);

// Parse inscription from script
router.post('/inscription', parseInscription);

// Parse cosigner scripts
router.post('/cosigner-scripts', parseCosignerScripts);

// Generate HDWallet (example)
router.post('/hdwallet', generateHDWallet);

export default router;

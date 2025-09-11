import mneeService from '../services/mneeService.js';

// Parse transaction by txid
export const parseTx = async (req, res, next) => {
  try {
    const { txid } = req.params;
    const { includeRaw } = req.query;

    const parsedTx = await mneeService.parseTx(txid, { includeRaw: includeRaw === 'true' });
    res.json({ success: true, data: parsedTx });
  } catch (error) {
    console.error('Error parsing transaction by txid:', error);
    next(error);
  }
};

// Parse transaction from raw hex
export const parseTxFromRaw = async (req, res, next) => {
  try {
    const { rawTxHex, includeRaw } = req.body;

    const parsedTx = await mneeService.parseTxFromRawTx(rawTxHex, { includeRaw });
    res.json({ success: true, data: parsedTx });
  } catch (error) {
    console.error('Error parsing transaction from raw hex:', error);
    next(error);
  }
};

// Parse inscription
export const parseInscription = (req, res, next) => {
  try {
    const { script } = req.body;

    const result = mneeService.parseInscription(script);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error parsing inscription:', error);
    next(error);
  }
};

// Parse cosigner scripts
export const parseCosignerScripts = (req, res, next) => {
  try {
    const { scripts } = req.body;

    const result = mneeService.parseCosignerScripts(scripts);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error parsing cosigner scripts:', error);
    next(error);
  }
};

// Generate HDWallet instance (Example purpose only)
export const generateHDWallet = (req, res, next) => {
  try {
    const { mnemonic, options } = req.body;

    const hdWallet = mneeService.HDWallet(mnemonic, options);
    res.json({ success: true, data: 'HDWallet instance created' });
  } catch (error) {
    console.error('Error generating HDWallet:', error);
    next(error);
  }
};

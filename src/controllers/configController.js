import mneeService from '../services/mneeService.js';

// Get MNEE configuration
export const getConfig = async (req, res, next) => {
  try {
    const config = await mneeService.config();
    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Error getting config:', error);
    next(error);
  }
};

// Validate MNEE transaction
export const validateMneeTx = async (req, res, next) => {
  try {
    const { rawTxHex, request } = req.body;

    const isValid = await mneeService.validateMneeTx(rawTxHex, request);
    res.json({ success: true, data: { isValid } });
  } catch (error) {
    console.error('Error validating MNEE transaction:', error);
    next(error);
  }
};

// Convert to atomic amount
export const toAtomicAmount = (req, res, next) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a number'
      });
    }

    const atomicAmount = mneeService.toAtomicAmount(amount);
    res.json({ success: true, data: { atomicAmount } });
  } catch (error) {
    console.error('Error converting to atomic amount:', error);
    next(error);
  }
};

// Convert from atomic amount
export const fromAtomicAmount = (req, res, next) => {
  try {
    const { atomicAmount } = req.body;

    if (typeof atomicAmount !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Atomic amount must be a number'
      });
    }

    const amount = mneeService.fromAtomicAmount(atomicAmount);
    res.json({ success: true, data: { amount } });
  } catch (error) {
    console.error('Error converting from atomic amount:', error);
    next(error);
  }
};

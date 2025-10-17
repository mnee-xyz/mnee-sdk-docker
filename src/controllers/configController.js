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

    if(!rawTxHex || typeof rawTxHex !== 'string' || rawTxHex.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Transaction Hex is required"
      });
    }
    if (!/^[0-9a-fA-F]+$/.test(rawTxHex.trim())) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid transaction hex format' 
      });
    }

    if (request !== undefined) {
      if (!Array.isArray(request)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Request must be an array' 
        });
      }
      
      if (request.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Request array cannot be empty' 
        });
      }

      for (let i = 0; i < request.length; i++) {
        const req = request[i];
        
        if (!req || typeof req !== 'object') {
          return res.status(400).json({ 
            success: false, 
            error: `Invalid request item at index ${i}` 
          });
        }
        
        if (!req.address || typeof req.address !== 'string' || req.address.trim() === '') {
          return res.status(400).json({ 
            success: false, 
            error: `Request address is required at index ${i}` 
          });
        }
        
        if (typeof req.amount !== 'number' || req.amount <= 0 || !isFinite(req.amount)) {
          return res.status(400).json({ 
            success: false, 
            error: `Amount should be positive number at index ${i}` 
          });
        }
      }
    }

    const isValid = await mneeService.validateMneeTx(rawTxHex, request);
    res.json({ success: true, data: { isValid } });
  } catch (error) {
    console.error('Error validating MNEE transaction:', error);
    if (error.message === "Invalid cosigner detected") {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
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

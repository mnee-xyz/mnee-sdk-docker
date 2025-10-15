import mneeService from '../services/mneeService.js';

// history
export const getRecentTxHistory = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { fromScore, limit, order } = req.query;

    const history = await mneeService.getRecentTxHistory(
      address,
      Number(fromScore) || undefined,
      Number(limit) || undefined,
      order || undefined
    );

    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching recent transaction history:', error);
    const badRequestMessages = [
      "Invalid Bitcoin address",
      "Invalid fromScore:",
      "Invalid limit:",
      "Invalid order:"
    ];
    if (badRequestMessages.some(msg => error.message.includes(msg))) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};
// histories
export const getRecentTxHistories = async (req, res, next) => {
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses)) {
      return res.status(400).json({ success: false, message: 'Addresses must be an array' });
    }

    const histories = await mneeService.getRecentTxHistories(addresses);
    res.json({ success: true, data: histories });
  } catch (error) {
    console.error('Error fetching multiple transaction histories:', error);
    const badRequestMessages = [
      "You must pass at least 1 valid address",
      "Invalid fromScore:",
      "Invalid limit:",
      "Invalid order:"
    ];
    if (badRequestMessages.some(msg => error.message.includes(msg))) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};
// Get status by ticket id
export const getTxStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const status = await mneeService.getTxStatus(ticketId);
    res.json({ success: true, data: status });
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    if (error.message === "Failed to get transaction status: 400") {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Transfer MNEE tokens using a WIF key
export const transfer = async (req, res, next) => {
    try {
      const { request, wif, transferOptions } = req.body;
  
      if (!request || !wif) {
        return res.status(400).json({ success: false, message: 'Missing request or wif' });
      }
  
      const result = await mneeService.transfer(request, wif, transferOptions);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error executing transfer:', error);
      const badRequestMessages = [
        "Invalid recipient address",
        "Invalid WIF key",
        "Invalid amount for",
        "minimum transfer amount is",
        "Invalid amount: total must be greater than 0"
      ];
      if (badRequestMessages.some(msg => error.message.includes(msg))) {
        error.statusCode = 400;
      } else {
        error.statusCode = 500;
      }
      next(error);
    }
  };
  
  // Transfer MNEE tokens using multiple UTXOs
  export const transferMulti = async (req, res, next) => {
    try {
      const { options, transferOptions } = req.body;
  
      if (!options) {
        return res.status(400).json({ success: false, message: 'Missing transfer options' });
      }
  
      const result = await mneeService.transferMulti(options, transferOptions);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error executing transferMulti:', error);
      const badRequestMessages = [
        "Invalid recipient address",
        "Invalid WIF key",
        "Invalid amount for",
        "minimum transfer amount is",
        "Invalid amount: total must be greater than 0"
      ];
      if (badRequestMessages.some(msg => error.message.includes(msg))) {
        error.statusCode = 400;
      } else {
        error.statusCode = 500;
      }
      next(error);
    }
  };
  
  // Submit a raw transaction hex string
  export const submitRawTx = async (req, res, next) => {
    try {
      const { rawTxHex, transferOptions } = req.body;
  
      if (!rawTxHex) {
        return res.status(400).json({ success: false, message: 'Missing rawTxHex' });
      }
  
      const result = await mneeService.submitRawTx(rawTxHex, transferOptions);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error submitting raw transaction:', error);
      const badRequestMessages = [
        "Failed to submit transaction: 400",
        "Callback URL cannot be provided when",
        "Raw transaction is required"
      ];
      if (badRequestMessages.some(msg => error.message.includes(msg))) {
        error.statusCode = 400;
      } else {
        error.statusCode = 500;
      }
      next(error);
    }
  };
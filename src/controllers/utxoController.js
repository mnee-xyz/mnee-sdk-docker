import mneeService from "../services/mneeService.js";

// Get UTXOs for an address (with optional pagination)
export const getUtxos = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { page, size, order } = req.query;

    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    const utxos = await mneeService.getUtxos(address, page ? Number(page) : undefined, size ? Number(size) : undefined, order);

    res.json({ success: true, data: utxos });
  } catch (error) {
    console.error("Error fetching UTXOs:", error);
    if (error.message.includes("Invalid Bitcoin address")) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Get UTXOs enough to cover a total amount
export const getEnoughUtxos = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { amount } = req.query;

    if (!address || !amount) {
      return res.status(400).json({ success: false, message: "Address and amount are required" });
    }

    const utxos = await mneeService.getEnoughUtxos(address, Number(amount));

    res.json({ success: true, data: utxos });
  } catch (error) {
    console.error("Error fetching enough UTXOs:", error);
    if (error.message.includes("Invalid Bitcoin address")) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Get all UTXOs for an address
export const getAllUtxos = async (req, res, next) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    const utxos = await mneeService.getAllUtxos(address);

    res.json({ success: true, data: utxos });
  } catch (error) {
    console.error("Error fetching all UTXOs:", error);
    if (error.message.includes("Invalid Bitcoin address")) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};

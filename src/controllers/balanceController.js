import mneeService from "../services/mneeService.js";

// Single address balance
export const getBalance = async (req, res, next) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    const balance = await mneeService.getBalance(address);

    res.json({
      success: true,
      data: balance,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    if (error.message.includes("Invalid Bitcoin address")) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Multiple addresses balance
export const getBalances = async (req, res, next) => {
  try {
    // Accept addresses as array
    const { addresses } = req.query;

    if (!addresses) {
      return res.status(400).json({ success: false, message: "Addresses are required" });
    }

    const addressArray = addresses.split(",").map(addr => addr.trim());

    const balances = await mneeService.getBalances(addressArray);

    res.json({
      success: true,
      data: balances,
    });
  } catch (error) {
    console.error("Error fetching balances:", error);
    if (error.message.includes("You must pass at least 1 valid address")) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    next(error);
  }
};

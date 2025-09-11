import express from "express";
import { getUtxos, getEnoughUtxos, getAllUtxos } from "../controllers/utxoController.js";

const router = express.Router();

// GET paginated UTXOs: /api/utxos/:address?page=1&size=10&order=asc
router.get("/:address", getUtxos);

// GET enough UTXOs to cover amount: /api/utxos/:address/enough?amount=10000
router.get("/:address/enough", getEnoughUtxos);

// GET all UTXOs: /api/utxos/:address/all
router.get("/:address/all", getAllUtxos);

export default router

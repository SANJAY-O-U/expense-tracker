const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.get("/", protect, getTransactions);
router.post("/", protect, createTransaction);
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
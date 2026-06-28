const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const { category, search, type } = req.query;
    const filter = { user: req.user._id };
    if (category && category !== "All") filter.category = category;
    if (type && type !== "All") filter.type = type;
    if (search) filter.title = { $regex: search, $options: "i" };

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, note } = req.body;
    if (!title || !amount || !type || !category || !date)
      return res.status(400).json({ message: "All required fields must be filled" });

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date,
      note,
    });
    res.status(201).json(transaction);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    const { title, amount, type, category, date, note } = req.body;
    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;
    transaction.note = note !== undefined ? note : transaction.note;

    const updated = await transaction.save();
    res.status(200).json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };
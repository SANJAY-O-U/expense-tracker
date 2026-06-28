const Transaction = require("../models/Transaction");

const getDashboard = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Monthly expense data for the last 6 months
    const now = new Date();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();

      const monthExpense = transactions
        .filter((t) => {
          const d = new Date(t.date);
          return t.type === "expense" && d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const monthIncome = transactions
        .filter((t) => {
          const d = new Date(t.date);
          return t.type === "income" && d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: date.toLocaleString("default", { month: "short", year: "2-digit" }),
        expense: monthExpense,
        income: monthIncome,
      });
    }

    // Category breakdown for expenses
    const categoryBreakdown = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      monthlyData,
      categoryBreakdown,
      recentTransactions: await Transaction.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(5),
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboard };
import { useState, useEffect } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import ExpenseChart from "../components/ExpenseChart";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Income"
          amount={data.totalIncome}
          color="border-green-500"
          icon="📈"
        />
        <StatCard
          title="Total Expense"
          amount={data.totalExpense}
          color="border-red-500"
          icon="📉"
        />
        <StatCard
          title="Current Balance"
          amount={data.balance}
          color={data.balance >= 0 ? "border-indigo-500" : "border-orange-500"}
          icon="💰"
        />
      </div>

      <div className="mb-8">
        <ExpenseChart monthlyData={data.monthlyData} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        {data.recentTransactions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {data.recentTransactions.map((t) => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.title}</p>
                  <p className="text-xs text-gray-400">
                    {t.category} · {new Date(t.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {Object.keys(data.categoryBreakdown).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Expense by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(data.categoryBreakdown).map(([cat, amt]) => (
              <div key={cat} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{cat}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  ₹{Number(amt).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
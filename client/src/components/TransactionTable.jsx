import { useState } from "react";

const CATEGORIES = ["All", "Food", "Travel", "Shopping", "Bills", "Salary", "Others"];

const TransactionTable = ({ transactions, onEdit, onDelete, deletingId }) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = transactions.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchType = typeFilter === "All" || t.type === typeFilter;
    return matchSearch && matchCategory && matchType;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Transactions</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option>All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No transactions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-2 text-gray-600 font-medium">Title</th>
                <th className="text-left px-3 py-2 text-gray-600 font-medium">Category</th>
                <th className="text-left px-3 py-2 text-gray-600 font-medium">Type</th>
                <th className="text-left px-3 py-2 text-gray-600 font-medium">Amount</th>
                <th className="text-left px-3 py-2 text-gray-600 font-medium">Date</th>
                <th className="text-left px-3 py-2 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {t.title}
                    {t.note && <p className="text-xs text-gray-400 font-normal">{t.note}</p>}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{t.category}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className={`px-3 py-2 font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    {new Date(t.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(t)}
                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(t._id)}
                        disabled={deletingId === t._id}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition disabled:opacity-50"
                      >
                        {deletingId === t._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
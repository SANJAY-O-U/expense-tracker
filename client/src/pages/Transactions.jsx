import { useState, useEffect } from "react";
import api from "../api/axios";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editData) {
        const res = await api.put(`/transactions/${editData._id}`, formData);
        setTransactions((prev) => prev.map((t) => (t._id === editData._id ? res.data : t)));
        setEditData(null);
      } else {
        const res = await api.post("/transactions", formData);
        setTransactions((prev) => [res.data, ...prev]);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500 text-sm">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm
            onSubmit={handleSubmit}
            editData={editData}
            onCancel={() => setEditData(null)}
            loading={formLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <TransactionTable
            transactions={transactions}
            onEdit={setEditData}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
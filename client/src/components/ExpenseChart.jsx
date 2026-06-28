import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseChart = ({ monthlyData }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Overview</h2>
        <p className="text-center text-gray-400 text-sm py-8">No data available</p>
      </div>
    );
  }

  const data = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Income",
        data: monthlyData.map((d) => d.income),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Expense",
        data: monthlyData.map((d) => d.expense),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Overview (Last 6 Months)</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;
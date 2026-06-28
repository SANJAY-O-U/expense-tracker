const StatCard = ({ title, amount, color, icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            ₹{Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

export default StatCard;
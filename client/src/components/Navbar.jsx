import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `text-sm font-medium transition ${
      location.pathname === path
        ? "text-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-lg font-bold text-indigo-600">
          💰 ExpenseTracker
        </Link>
        {user && (
          <div className="flex items-center gap-5">
            <Link to="/dashboard" className={linkClass("/dashboard")}>Dashboard</Link>
            <Link to="/transactions" className={linkClass("/transactions")}>Transactions</Link>
            <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
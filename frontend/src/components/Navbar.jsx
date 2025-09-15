import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../redux/authSlice";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ add navigate
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/serial", label: "Serial" },
    { path: "/add-guest", label: "Add Guest" },
    { path: "/settings", label: "Settings" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img className="h-8 sm:h-10 w-auto" src={logo} alt="Logo" />
            </Link>
            {isAuthenticated && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8 lg:space-x-10">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative flex items-center text-sm lg:text-base text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="underline"
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-indigo-600 rounded-full"
                        initial={false}
                      />
                    )}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 sm:space-x-6">
              <span
                className="dark:text-purple-400 text-sm lg:text-base font-medium hidden sm:block"
                title="User Name"
              >
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm lg:text-base hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 text-sm lg:text-base hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm lg:text-base hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

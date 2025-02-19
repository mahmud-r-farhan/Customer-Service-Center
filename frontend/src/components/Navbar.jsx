import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../redux/authSlice";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/serial", label: "Serial" },
    { path: "/add-guest", label: "Add Guest" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-10 w-auto" src={logo} alt="Logo" />
            </Link>

            {isAuthenticated && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-10">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative inline-flex items-center px-2 pt-2 text-gray-900 text-lg"
                  >
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="underline"
                        className="absolute left-0 right-0 bottom-0 h-1 bg-indigo-600"
                      />
                    )}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center">
              <span className="text-gray-700 text-lg font-medium mr-6">{user?.name}</span>
              <button
                onClick={() => dispatch(logout())}
                className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-gray-700 text-lg hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-lg hover:bg-indigo-700 transition-colors"
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

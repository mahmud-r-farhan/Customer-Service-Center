import { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { verifyCredentials } from "./redux/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Loading from './components/Spinner';

// Lazy-loaded pages for faster initial load
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Serial = lazy(() => import("./pages/Serial"));
const AddGuest = lazy(() => import("./pages/AddGuest"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  const dispatch = useDispatch();
  const { authChecked, isAuthenticated } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.settings.theme);

  useEffect(() => {
    // On app start, verify session via cookie-based auth
    dispatch(verifyCredentials());
  }, [dispatch]);

  // Keep the `dark` class on <html> in sync with the persisted theme.
  // (index.html also applies this before React mounts to avoid a flash.)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Only block on the initial session check, not on every subsequent
  // auth-related request (e.g. saving settings), which previously caused
  // the whole app (and its WebSocket connection) to unmount/remount.
  if (!authChecked) return <Loading />;

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {isAuthenticated && <Navbar />}
        {/* Ensure websocket is connected for all authenticated users */}
        {isAuthenticated && <AuthenticatedWSConnector />}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/serial"
                element={
                  <ProtectedRoute>
                    <Serial />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-guest"
                element={
                  <ProtectedRoute>
                    <AddGuest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback for unknown routes */}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </Suspense>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

function AuthenticatedWSConnector() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: 'ws/connect' });
    return () => dispatch({ type: 'ws/disconnect' });
  }, [dispatch]);
  return null;
}

export default App;
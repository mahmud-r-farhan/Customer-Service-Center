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
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // On app start, verify session via cookie-based auth
    dispatch(verifyCredentials());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {isAuthenticated && <Navbar />}
        {/* Ensure websocket is connected for all authenticated users */}
        {isAuthenticated && <AuthenticatedWSConnector />}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

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

              {/* Default redirect */}
              <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
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
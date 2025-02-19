import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Dashboard from "./pages/Dashboard"
import Serial from "./pages/Serial"
import AddGuest from "./pages/AddGuest"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import PrivateRoute from "./components/PrivatRoute"
import Navbar from "./components/Navbar"
import Register from "./pages/Register"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
      <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/serial"
              element={
                <PrivateRoute>
                  <Serial />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-guest"
              element={
                <PrivateRoute>
                  <AddGuest />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App


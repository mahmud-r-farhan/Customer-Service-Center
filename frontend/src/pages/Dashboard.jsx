import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchClients, updateClientStatus, setCurrentClient, clearCurrentClient } from "../redux/clientsSlice";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from 'xlsx';
import { FiDownloadCloud, FiClock, FiCheckCircle, FiUser, FiUsers, FiCalendar, FiMaximize, FiMinimize } from "react-icons/fi";

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Dashboard = React.memo(() => {
  const dispatch = useDispatch();
  const { list: clients, loading, currentClient } = useSelector((state) => state.clients);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    dispatch(fetchClients()).then(() => {
      console.log("Clients fetched:", clients); // Debug: Verify clients array
    });
    dispatch({ type: "ws/connect" });
    return () => dispatch({ type: "ws/disconnect" });
  }, [dispatch]);

  const handleConsult = useCallback((client) => {
    dispatch(setCurrentClient(client));
    toast.success(`Started consultation with ${client.name}`);
  }, [dispatch]);

  const handleDone = useCallback(() => {
    if (currentClient) {
      dispatch(updateClientStatus({ id: currentClient._id, status: "done" }))
        .unwrap()
        .then(() => {
          toast.success("Client consultation completed");
          dispatch(clearCurrentClient());
        })
        .catch((error) => toast.error(error.message || "Failed to update client status"));
    }
  }, [dispatch, currentClient]);

  const handleExport = useCallback(debounce(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last24Clients = clients.filter(c => new Date(c.createdAt) >= last24h);
    const data = last24Clients.map(c => ({
      Name: c.name,
      Phone: c.number,
      Token: c.token,
      Status: c.status,
      Created: new Date(c.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Last 24 Hours");
    XLSX.writeFile(wb, `queue-clients-${now.toISOString().split('T')[0]}.xlsx`);
    toast.success("Exported to Excel");
  }, 1000), [clients]);

  const upcomingClients = useMemo(() => clients.filter((client) => client.status === "upcoming"), [clients]);
  const completedToday = useMemo(() => {
    const last24h = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return clients.filter(
      (client) =>
        client.status === "done" &&
        new Date(client.updatedAt || client.createdAt) > last24h
    ).length;
  }, [clients]);
  const totalClients = clients.length;
  const activeClients = upcomingClients.length;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Consultant Area JSX extracted for reuse
  const ConsultantArea = (
    <div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Consultant Area
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Let's consult today's clients!
          </p>
        </div>
        <motion.button
          onClick={toggleFullScreen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 shadow-md"
        >
          {isFullScreen ? (
            <>
              <FiMinimize className="w-5 h-5" />
              <span>Exit Full Screen</span>
            </>
          ) : (
            <>
              <FiMaximize className="w-5 h-5" />
              <span>Full Screen</span>
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiClock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span>Upcoming Clients</span>
            </h2>
            {activeClients > 0 && (
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
                {activeClients} waiting
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {upcomingClients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center mb-4">
                  <FiUser className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">All caught up!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">No clients in queue right now</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-600"
              >
                <AnimatePresence>
                  {upcomingClients.map((client, index) => (
                    <motion.div
                      key={client._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold"
                          >
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{client.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">#{client.token}</span>
                              <span>Position: {index + 1}</span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleConsult(client)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                        >
                          Start Consult
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span>Active Session</span>
          </h2>

          <AnimatePresence mode="wait">
            {currentClient ? (
              <motion.div
                key="active-client"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold"
                    >
                      {currentClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{currentClient.name}</h3>
                      <p className="text-green-600 dark:text-green-400 text-sm">In consultation</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Phone Number</p>
                      <p className="text-gray-900 dark:text-white">{currentClient.number}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Token</p>
                      <p className="font-mono text-base font-bold text-green-600 dark:text-green-400">#{currentClient.token}</p>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={handleDone}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                >
                  Complete Consultation
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="no-client"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-500 rounded-full flex items-center justify-center mb-4">
                  <FiUser className="w-6 h-6 text-gray-400 dark:text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">Ready to help</h3>
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">Start a consultation to begin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen text-center space-y-4"
      >
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Loading dashboard...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Customer Service Center
            </p>
          </div>
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 shadow-md"
          >
            <FiDownloadCloud className="w-5 h-5" />
            <span>Export Data</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">All-Time Clients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClients}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Active Queue</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{activeClients}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Completed (Last 24h)</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedToday}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Today</p>
                <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Consultant Area (Normal View) */}
        {!isFullScreen && ConsultantArea}

        {/* Full-Screen Modal */}
        <AnimatePresence>
          {isFullScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={toggleFullScreen}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 w-full h-full p-4 sm:p-6 lg:p-10 overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="max-w-7xl mx-auto">
                  {ConsultantArea}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default Dashboard;
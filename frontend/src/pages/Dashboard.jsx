import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { prepareAndExportLast24hClients } from '../utils/xlsx';
import { useConsultant } from '../utils/consultant'; 
import { FiDownloadCloud, FiUsers, FiClock, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import { fetchClients } from '../redux/clientsSlice';
import Spinner from '../components/Spinner';
import ConsultantArea from '../components/ConsultantArea';

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
  const { list: clients, loading } = useSelector((state) => state.clients);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Use extracted consultant hook for better performance (memoized handlers)
  const { handleConsult, handleDone, currentClient, agentName } = useConsultant();

  useEffect(() => {
    dispatch(fetchClients());
    dispatch({ type: 'ws/connect' });
    return () => dispatch({ type: 'ws/disconnect' });
  }, [dispatch]);

  const queuedClients = useMemo(() =>
    clients.filter((client) => client.status === 'queued'),
    [clients]
  );

  const completedToday = useMemo(() => {
    const last24h = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return clients.filter(
      (client) =>
        client.status === 'done' &&
        new Date(client.updatedAt || client.createdAt) > last24h
    ).length;
  }, [clients]);

  const totalClients = clients.length;
  const activeClients = queuedClients.length;

  // Refactored handleExport to use the extracted utility for better maintainability
  const handleExport = useCallback(
    debounce(() => {
      prepareAndExportLast24hClients(clients); // Using extracted utility
      // Note: toast.success is now handled in the component, but could be moved if needed
    }, 1000),
    [clients]
  );

  const upcomingClients = useMemo(() =>
    queuedClients.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [queuedClients]
  );

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (loading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
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
              Customer Service Center - Welcome, {agentName}
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
        {!isFullScreen && (
          <ConsultantArea
            isFullScreen={isFullScreen}
            toggleFullScreen={toggleFullScreen}
            upcomingClients={upcomingClients}
            activeClients={activeClients}
            handleConsult={handleConsult}
            handleDone={handleDone}
            currentClient={currentClient}
            agentName={agentName}
          />
        )}
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
                  <ConsultantArea
                    isFullScreen={isFullScreen}
                    toggleFullScreen={toggleFullScreen}
                    upcomingClients={upcomingClients}
                    activeClients={activeClients}
                    handleConsult={handleConsult}
                    handleDone={handleDone}
                    currentClient={currentClient}
                    agentName={agentName}
                  />
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
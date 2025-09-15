import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinimize, FiMaximize, FiClock, FiCheckCircle, FiUser } from 'react-icons/fi';

const ConsultantArea = ({
  isFullScreen,
  toggleFullScreen,
  upcomingClients,
  activeClients,
  handleConsult,
  handleDone,
  currentClient,
  agentName,
}) => {
  return (
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
            Welcome, {agentName}! Let's consult today's clients.
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
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
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
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${client.agent ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <motion.button
                            onClick={() => handleConsult(client)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                          >
                            Start Consult
                          </motion.button>
                        </div>
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
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {currentClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{currentClient.name}</h3>
                      <p className="text-green-600 dark:text-green-400 text-sm">In consultation</p>
                      {currentClient.agent && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Consultant: {currentClient.agent}
                        </p>
                      )}
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
};

export default ConsultantArea;
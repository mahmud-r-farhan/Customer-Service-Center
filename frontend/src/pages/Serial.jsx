import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchClients } from "../redux/clientsSlice";
import {
  FaRegClock,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { FiMaximize, FiMinimize } from "react-icons/fi";

function Serial() {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.list);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Sort clients by createdAt in ascending order to ensure last registered is last
  const nextClients = clients
    .filter((client) => client.status === "upcoming")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const completedClients = clients.filter(
    (client) =>
      client.status === "done" && new Date(client.updatedAt) > last24h
  );

  const currentClient = nextClients[0];
  const upcomingClients = nextClients.slice(1);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch({ type: "ws/connect" });
    return () => {
      dispatch({ type: "ws/disconnect" });
    };
  }, [dispatch]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const SerialContent = (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="flex justify-between items-center w-full max-w-7xl mb-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Serial Queue
          </h1>
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
        </div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          {/* In Queue */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">In Queue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{nextClients.length}</p>
              </div>
            </div>
          </div>

          {/* Completed (Last 24h) */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed (24h)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedClients.length}</p>
              </div>
            </div>
          </div>

          {/* Est. Wait */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FaRegClock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Est. Wait</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {upcomingClients.length * 5}min
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Now Serving Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 rounded-2xl shadow-2xl border ">
            <motion.div
              animate={{
                background: [
                  "linear-gradient(45deg, #3730a3, #7c3aed, #ec4899)",
                  "linear-gradient(45deg, #7c3aed, #ec4899, #3730a3)",
                  "linear-gradient(45deg, #ec4899, #3730a3, #7c3aed)",
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 rounded-2xl blur-sm"
            />
            <div className="relative z-10">
              <motion.h1
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-8 tracking-tight"
              >
                Now Serving
              </motion.h1>

              <AnimatePresence mode="wait">
                {currentClient ? (
                  <motion.div
                    key={currentClient._id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        textShadow: [
                          "0 0 20px rgba(255,255,255,0.5)",
                          "0 0 40px rgba(255,255,255,0.8)",
                          "0 0 20px rgba(255,255,255,0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30"
                    >
                      <h2 className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white mb-4 font-mono tracking-wider">
                        {currentClient.token}
                      </h2>
                      <p className="text-2xl sm:text-3xl lg:text-4xl text-white/90 font-medium">
                        {currentClient.name}
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-12 border border-white/30">
                      <FaRegClock className="h-16 w-16 text-white/60 mx-auto mb-4" />
                      <p className="text-3xl sm:text-4xl text-white font-medium">Queue is Empty</p>
                      <p className="text-lg text-white/80 mt-2">Ready for the next client</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Queue Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          {/* Next in Line */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Next in Line ({upcomingClients.length})
              </h2>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <AnimatePresence>
                {upcomingClients.map((client, index) => (
                  <motion.div
                    key={client._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group relative"
                  >
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-100 dark:border-gray-600 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white font-bold text-xl rounded-xl font-mono">
                          {client.token}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {client.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Position {index + 1} • ~{(index + 1) * 5} min wait
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FaRegClock className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {upcomingClients.length === 0 && (
                <div className="text-center py-12">
                  <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No clients in queue</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recently Completed (Last 24h) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recently Completed (24h)
              </h2>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <AnimatePresence>
                {completedClients.slice(0, 10).map((client, index) => (
                  <motion.div
                    key={client._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-100 dark:border-green-800 transition-all duration-200 group-hover:shadow-md">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white font-bold rounded-lg font-mono">
                          {client.token}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Completed {new Date(client.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {completedClients.length === 0 && (
                <div className="text-center py-12">
                  <FaCheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No completed services in last 24h</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen shadow-sm">
      {!isFullScreen ? (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {SerialContent}
        </div>
      ) : (
        <AnimatePresence>
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
              className="bg-white/95 w-full h-full p-4 sm:p-6 lg:p-10 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-7xl mx-auto">
                {SerialContent}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Serial;
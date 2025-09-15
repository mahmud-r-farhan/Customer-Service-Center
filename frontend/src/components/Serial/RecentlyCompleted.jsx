import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

function RecentlyCompleted({ completedClients, calculateConsultationTime }) {
  // updatedAt descending order
  const sortedClients = [...completedClients].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
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
          {sortedClients.slice(0, 10).map((client, index) => (
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
                      Completed {new Date(client.updatedAt).toLocaleTimeString()} •{" "}
                      {calculateConsultationTime(client)}
                    </p>
                    {client.agent && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consultant: {client.agent}
                      </p>
                    )}
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
            <p className="text-gray-500 dark:text-gray-400">
              No completed services in last 24h
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default RecentlyCompleted;
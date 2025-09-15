import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaUsers } from "react-icons/fa";

function NextInLine({ displayUpcoming }) {
  return (
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
          Next in Line ({displayUpcoming.length})
        </h2>
      </div>
      <div className="space-y-3 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <AnimatePresence>
          {displayUpcoming.map((client, index) => (
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
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {displayUpcoming.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No clients in queue</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NextInLine;
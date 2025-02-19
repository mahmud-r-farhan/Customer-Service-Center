import { useSelector } from "react-redux"
import { motion } from "framer-motion"

function Serial() {
  const clients = useSelector((state) => state.clients.list)
  const nextClients = clients.filter((client) => client.status === "upcoming")
  const completedClients = clients.filter((client) => client.status === "done")

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-lg shadow-2xl">
        <h1 className="text-6xl font-bold text-white text-center mb-4">Now Serving</h1>
        {nextClients[0] ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-center"
          >
            <h2 className="text-8xl font-bold text-white mb-2">{nextClients[0].token}</h2>
            <p className="text-3xl text-white opacity-90">{nextClients[0].name}</p>
          </motion.div>
        ) : (
          <p className="text-4xl text-white text-center">No clients waiting</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Next in Line</h2>
          <div className="space-y-4">
            {nextClients.slice(1).map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="text-2xl font-bold text-indigo-600">{client.token}</span>
                  <p className="text-gray-600">{client.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Recently Completed</h2>
          <div className="space-y-2">
            {completedClients.slice(0, 5).map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
              >
                <span className="text-xl text-green-600">{client.token}</span>
                <span className="text-gray-600">{client.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Serial


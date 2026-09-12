import { motion } from "framer-motion";
import { FaRegClock } from "react-icons/fa";

function NowServing({ consultingClients = [], fallbackClient = null }) {
  const items = consultingClients.length > 0 ? consultingClients : (fallbackClient ? [fallbackClient] : []);

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8 rounded-2xl shadow-2xl border relative overflow-hidden">
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, #3730a3, #7c3aed, #ec4899)",
            "linear-gradient(45deg, #7c3aed, #ec4899, #3730a3)",
            "linear-gradient(45deg, #ec4899, #3730a3, #7c3aed)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 rounded-2xl blur-sm"
      />
      <div className="relative z-10">
        <motion.h1
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-6 tracking-tight"
        >
          Now Serving
        </motion.h1>

        {items.length === 0 ? (
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <FaRegClock className="h-12 w-12 text-white/60 mx-auto mb-3" />
              <p className="text-2xl sm:text-3xl text-white font-medium">Queue is Empty</p>
              <p className="text-sm text-white/80 mt-2">Ready for the next client</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 16 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/30 flex flex-col items-center"
              >
                <div className="text-center">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2 font-mono tracking-wider">{c.token}</h2>
                  <p className="text-lg sm:text-xl text-white/90 font-medium">{c.name}</p>
                  {c.status === "consulting" && c.agent && (
                    <p className="text-sm text-white/80 mt-2">Consulting with: <span className="font-semibold">{c.agent}</span></p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NowServing;
import { motion, AnimatePresence } from "framer-motion";
import { FaRegClock } from "react-icons/fa";

function NowServing({ displayCurrent }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-12 rounded-2xl shadow-2xl border">
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
          {displayCurrent ? (
            <motion.div
              key={displayCurrent._id}
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
                  {displayCurrent.token}
                </h2>
                <p className="text-2xl sm:text-3xl lg:text-4xl text-white/90 font-medium">
                  {displayCurrent.name}
                </p>
                {displayCurrent.status === "consulting" && displayCurrent.agent && (
                  <p className="text-lg text-white/80 mt-2">
                    Consulting with: {displayCurrent.agent}
                  </p>
                )}
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
  );
}

export default NowServing;
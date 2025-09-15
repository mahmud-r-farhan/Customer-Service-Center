import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize } from "react-icons/fi";

function FullScreenWrapper({ isFullScreen, onToggleFullScreen, content, maxWidth = "max-w-7xl", backgroundClass = "bg-white" }) {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {!isFullScreen ? (
        <div className={`${maxWidth} mx-auto relative z-10`}>
          {content}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onToggleFullScreen}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${backgroundClass} w-full h-full p-4 sm:p-6 lg:p-10 overflow-auto relative`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-60 h-60 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className={`${maxWidth} mx-auto relative z-10`}>
                {content}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default FullScreenWrapper;
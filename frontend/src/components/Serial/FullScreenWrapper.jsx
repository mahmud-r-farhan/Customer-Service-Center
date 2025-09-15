import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize } from "react-icons/fi";

function FullScreenWrapper({ isFullScreen, onToggleFullScreen, content }) {
  return (
    <div className="min-h-screen shadow-sm">
      {!isFullScreen ? (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {content}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={onToggleFullScreen}
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
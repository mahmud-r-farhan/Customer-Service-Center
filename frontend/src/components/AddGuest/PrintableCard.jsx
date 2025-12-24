import { motion } from "framer-motion";
import { FiUser, FiPhone } from "react-icons/fi";

function PrintableCard({ token, name, number, logo }) {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="print-card w-full sm:max-w-sm mx-auto px-4"
    >
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .print-card, .print-card * { visibility: visible; }
            .print-card { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none; }
            .print-card { page-break-inside: avoid; }
          }
        `}
      </style>

      <div className="relative bg-gradient-to-br from-white via-slate-50 to-indigo-50 py-6 px-6 sm:py-8 sm:px-10 rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <div className="relative text-center space-y-5">
          <div className="flex justify-center">
            <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm">
              <img
                src={logo}
                alt="Company Logo"
                loading="lazy"
                decoding="async"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Token Number</h3>
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-md">
              <span className="text-3xl sm:text-5xl font-extrabold tracking-tight" role="text" aria-label={`Token ${token}`}>{token}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <FiUser className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm sm:text-lg font-medium">{name}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" aria-hidden="true" />
              <a href={`tel:${number}`} className="text-sm sm:text-base text-gray-700 hover:underline">{number}</a>
            </div>
          </div>

          <div className="pt-3 sm:pt-4 border-t border-indigo-100">
            <time className="text-xs text-gray-500 block">{new Date().toLocaleString()}</time>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PrintableCard;
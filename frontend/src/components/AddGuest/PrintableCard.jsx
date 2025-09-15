import { motion } from "framer-motion";
import { FiUser, FiPhone } from "react-icons/fi";

function PrintableCard({ token, name, number, logo }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="print-card max-w-sm mx-auto"
    >
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .print-card, .print-card * { visibility: visible; }
            .print-card { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none; }
          }
        `}
      </style>
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-8 px-12 rounded-2xl shadow-2xl border border-indigo-200 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-300 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-300 rounded-full -ml-12 -mb-12"></div>
        </div>
        
        <div className="relative text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-full shadow-md">
              <img src={logo} alt="Company Logo" className="h-12 w-auto" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Token Number</h3>
            <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg">
              <span className="text-5xl font-black tracking-wider">{token}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <FiUser className="w-4 h-4" />
              <span className="text-lg font-medium">{name}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span className="text-base">{number}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-indigo-200">
            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PrintableCard;
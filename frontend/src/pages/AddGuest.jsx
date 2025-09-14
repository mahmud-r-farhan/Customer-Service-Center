import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { addClient } from "../redux/clientsSlice";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import logo from "../assets/logo.png";

function AddGuest() {
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [token, setToken] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const generateToken = () => Math.random().toString(36).substr(2, 6).toUpperCase();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!number || !name) {
      toast.error("Please fill in all fields");
      return;
    }
    const newToken = generateToken();
    dispatch(addClient({ number, name, token: newToken }))
      .unwrap()
      .then(() => {
        setToken(newToken);
        setShowPrint(true);
        toast.success("Guest added successfully");
      })
      .catch(() => toast.error("Failed to add guest"));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddAnother = () => {
    setShowPrint(false);
    setName("");
    setNumber("");
    setToken("");
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const PrintableCard = () => (
    <div className="print-card max-w-sm mx-auto">
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
      <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-indigo-600">
        <div className="text-center space-y-4">
          <img src={logo} alt="Company Logo" className="h-16 mx-auto" />
          <h2 className="text-4xl font-bold text-indigo-600">{token}</h2>
          <p className="text-xl text-gray-700">{name}</p>
          <p className="text-gray-700">{number}</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  const AddGuestContent = (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div className="flex justify-between items-center w-full mb-6">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent p-2">
            Add Guest
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
              </>
            ) : (
              <>
                <FiMaximize className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
        {!showPrint ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 w-full max-w-md">
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get Serial Token
            </button>
          </form>
        ) : (
          <div className="space-y-6 w-full max-w-md">
            <PrintableCard />
            <div className="flex flex-col sm:flex-row gap-4 no-print">
              <button
                onClick={handlePrint}
                className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Print Token
              </button>
              <button
                onClick={handleAddAnother}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add Another Guest
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8 flex justify-center">
      {!isFullScreen ? (
        <div className="max-w-md mx-auto">
          {AddGuestContent}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={toggleFullScreen}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 w-full h-full p-4 sm:p-6 lg:p-10 overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-md mx-auto">
                {AddGuestContent}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default AddGuest;
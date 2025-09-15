import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { addClient } from "../redux/clientsSlice";
import { FiMaximize, FiMinimize, FiPrinter, FiPlus } from "react-icons/fi";
import logo from "/app-logo.png";
import GuestForm from "../components/AddGuest/GuestForm";
import PrintableCard from "../components/AddGuest/PrintableCard";
import FullScreenWrapper from "../components/AddGuest/FullScreenWrapper";

function AddGuest() {
  const dispatch = useDispatch();
  const { loading: addingClient } = useSelector((state) => state.clients);
  const [showPrint, setShowPrint] = useState(false);
  const [token, setToken] = useState("");
  const [name, setName] = useState(""); // Keep local for form reset
  const [number, setNumber] = useState(""); // Keep local for form reset
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleSubmit = async (formData) => {
    const { name: formName, number: formNumber } = formData;
    if (!formNumber || !formName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await dispatch(addClient({ name: formName.trim(), number: formNumber })).unwrap();
      setToken(result.token);
      setShowPrint(true);
      toast.success("Guest added successfully");
    } catch (error) {
      console.error("Add client error:", error);
      toast.error(error.message || "Failed to add guest");
    }
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

  const AddGuestContent = (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div className="flex justify-between items-center w-full mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add Guest
            </h1>
          </motion.div>
          
          <motion.button
            onClick={toggleFullScreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isFullScreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
          </motion.button>
        </div>

        {!showPrint ? (
          <GuestForm
            name={name}
            number={number}
            addingClient={addingClient}
            onSubmit={handleSubmit}
            onNameChange={setName}
            onNumberChange={setNumber}
          />
        ) : (
          <div className="space-y-8 w-full max-w-md">
            <PrintableCard token={token} name={name} number={number} logo={logo} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 no-print"
            >
              <motion.button
                onClick={handlePrint}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FiPrinter className="w-5 h-5" />
                <span>Print Token</span>
              </motion.button>
              <motion.button
                onClick={handleAddAnother}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <FiPlus className="w-5 h-5" />
                <span>New Guest</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );

  return (
    <FullScreenWrapper
      isFullScreen={isFullScreen}
      onToggleFullScreen={toggleFullScreen}
      content={AddGuestContent}
      maxWidth="max-w-md"
      backgroundClass="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
    />
  );
}

export default AddGuest;
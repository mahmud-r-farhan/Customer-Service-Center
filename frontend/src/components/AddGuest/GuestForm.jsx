import { useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiUser } from "react-icons/fi";

function GuestForm({ name, number, addingClient, onSubmit, onNameChange, onNumberChange }) {
  const [formData, setFormData] = useState({ name, number });

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));
    onNameChange(value);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, number: value }));
    onNumberChange(value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      onSubmit={handleFormSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-8 rounded-2xl shadow-2xl space-y-6 w-full max-w-md border border-white/20"
    >
      <div className="space-y-2">
        <label htmlFor="number" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <FiPhone className="w-4 h-4" />
          <span>Phone Number</span>
        </label>
        <motion.input
          type="tel"
          id="number"
          value={formData.number}
          onChange={handleNumberChange}
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 backdrop-blur-sm"
          placeholder="Enter phone number"
          required
          disabled={addingClient}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <FiUser className="w-4 h-4" />
          <span>Full Name</span>
        </label>
        <motion.input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          whileFocus={{ scale: 1.02 }}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 backdrop-blur-sm"
          placeholder="Enter full name"
          required
          disabled={addingClient}
        />
      </div>

      <motion.button
        type="submit"
        disabled={addingClient}
        whileHover={addingClient ? {} : { scale: 1.02, boxShadow: "0 10px 40px rgba(99, 102, 241, 0.3)" }}
        whileTap={addingClient ? {} : { scale: 0.98 }}
        className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
          addingClient 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl"
        }`}
      >
        <span>{addingClient ? "Generating..." : "Generate Token"}</span>
      </motion.button>
    </motion.form>
  );
}

export default GuestForm;
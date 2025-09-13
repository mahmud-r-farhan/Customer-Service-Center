import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { addClient } from "../redux/clientsSlice";
import logo from "../assets/logo.png";

function AddGuest() {
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [token, setToken] = useState("");

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-8 p-4 sm:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Add Guest</h1>
      {!showPrint ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
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
            Register
          </button>
        </form>
      ) : (
        <div className="space-y-6">
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
  );
}

export default AddGuest;
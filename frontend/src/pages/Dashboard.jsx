import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchClients, updateClientStatus, setCurrentClient, clearCurrentClient } from "../redux/clientsSlice";
import { Spinner } from "../components/Spinner";
import { motion } from "framer-motion";

function Dashboard() {
  const dispatch = useDispatch();
  const { list: clients, loading, error, currentClient } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleConsult = (client) => {
    dispatch(setCurrentClient(client));
    toast.success(`Started consultation with ${client.name}`);
  };

  const handleDone = () => {
    if (currentClient) {
      dispatch(updateClientStatus({ id: currentClient._id, status: "done" }))
        .unwrap()
        .then(() => {
          toast.success("Client consultation completed");
          dispatch(clearCurrentClient());
        })
        .catch((error) => toast.error(error.message || "Failed to update client status"));
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error.message}</p>
        <button
          onClick={() => dispatch(fetchClients())}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const upcomingClients = clients.filter((client) => client.status === "upcoming");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-4 sm:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Clients</h2>
          {upcomingClients.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">No upcoming clients</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-96">
              {upcomingClients.map((client) => (
                <li key={client._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Token: {client.token}</p>
                  </div>
                  <button
                    onClick={() => handleConsult(client)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Consult
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Current Consultation</h2>
          {currentClient ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md space-y-2">
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Name:</span> {currentClient.name}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Number:</span> {currentClient.number}</p>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Token:</span> {currentClient.token}</p>
              </div>
              <button
                onClick={handleDone}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Complete Consultation
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No active consultation</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
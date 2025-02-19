import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { fetchClients, updateClientStatus, setCurrentClient, clearCurrentClient } from "../redux/clientsSlice"
import { Spinner } from "../components/Spinner"

function Dashboard() {
  const dispatch = useDispatch()
  const { list: clients, loading, error, currentClient } = useSelector((state) => state.clients)

  useEffect(() => {
    dispatch(fetchClients())
  }, [dispatch])

  const handleConsult = (client) => {
    dispatch(setCurrentClient(client))
    toast.success(`Started consultation with ${client.name}`)
  }

  const handleDone = () => {
    if (currentClient) {
      dispatch(updateClientStatus({ id: currentClient._id, status: "done" }))  // Changed from id to _id
        .unwrap()
        .then(() => {
          toast.success("Client consultation completed")
          dispatch(clearCurrentClient())
        })
        .catch((error) => {
          toast.error(error.message || "Failed to update client status")
        })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error.message}</p>
        <button
          onClick={() => dispatch(fetchClients())}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const upcomingClients = clients.filter((client) => client.status === "upcoming") || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Clients</h2>
          {upcomingClients.length === 0 ? (
            <p className="text-gray-500 text-center">No upcoming clients</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {upcomingClients.map((client) => (
                <li key={client._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-500">Token: {client.token}</p>
                  </div>
                  <button
                    onClick={() => handleConsult(client)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Consult
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Consultation</h2>
          {currentClient ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700"><span className="font-semibold">Name:</span> {currentClient.name}</p>
                <p className="text-gray-700"><span className="font-semibold">Number:</span> {currentClient.number}</p>
                <p className="text-gray-700"><span className="font-semibold">Token:</span> {currentClient.token}</p>
              </div>
              <button
                onClick={handleDone}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Complete Consultation
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500">No active consultation</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
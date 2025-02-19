import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { addClient } from "../redux/clientsSlice"
import logo from "../assets/logo.png";

function AddGuest() {
  const dispatch = useDispatch()
  const [number, setNumber] = useState("")
  const [name, setName] = useState("")
  const [showPrint, setShowPrint] = useState(false)
  const [token, setToken] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!number || !name) {
      toast.error("Please fill in all fields")
      return
    }
    const newToken = Math.random().toString(36).substr(2, 6).toUpperCase()
    dispatch(addClient({ number, name, token: newToken }))
    setToken(newToken)
    setShowPrint(true)
    toast.success("Guest added successfully")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleAddAnother = () => {
    setShowPrint(false)
    setName("")
    setNumber("")
    setToken("")
  }

  const PrintableCard = () => (
    <div className="print-card">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-card, .print-card * {
              visibility: visible;
            }
            .print-card {
              position: absolute;
              left: 0;
              top: 0;
              width: 80%;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>
      <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-indigo-600">
        <div className="text-center">
          <img src={logo} alt="Company Logo" className="h-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-indigo-600 mb-4">{token}</h2>
          <div className="space-y-2 text-gray-700">
            <p className="text-xl">{name}</p>
            <p>{number}</p>
            <p className="text-sm">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-xl mt-10 mx-auto"
    >
      <h1 className="text-3xl font-bold mb-4">Add Guest</h1>
      {!showPrint ? (
        <form onSubmit={handleSubmit} className="rounded-lg space-y-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="my-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="my-2  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <PrintableCard />
          <div className="flex gap-4 no-print">
            <button
              onClick={handlePrint}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition-colors"
            >
              Print Token
            </button>
            <button
              onClick={handleAddAnother}
              className="flex-1 bg-indigo-500 text-white px-4 py-3 rounded-md hover:bg-indigo-600 transition-colors"
            >
              Add Another Guest
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AddGuest


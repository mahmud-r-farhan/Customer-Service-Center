import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { updateUserSettings } from "../redux/authSlice"
import { motion } from "framer-motion"
import { updateSettings, toggleTheme } from "../redux/settingsSlice"
import { Switch } from "../components/Switch"

function Settings() {
  const dispatch = useDispatch()
  const settings = useSelector((state) => state.settings)
  const user = useSelector((state) => state.auth.user)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateUserSettings({ name, email }))
    toast.success("Settings updated successfully")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <h1 className="text-3xl font-bold text-black">Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="dark:text-white">Dark Mode</span>
              <Switch
                enabled={settings.theme === "dark"}
                onChange={() => dispatch(toggleTheme())}
              />
            </div>
            {/* Add more appearance settings */}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="dark:text-white">Sound Alerts</span>
              <Switch
                enabled={settings.sound}
                onChange={() => dispatch(updateSettings({ sound: !settings.sound }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="dark:text-white">Desktop Notifications</span>
              <Switch
                enabled={settings.notifications}
                onChange={() => dispatch(updateSettings({ notifications: !settings.notifications }))}
              />
            </div>
          </div>
        </div>

        {user?.role === "admin" && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Admin Settings</h2>
            {/* Add admin specific settings */}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Settings
        </button>
      </form>
    </motion.div>
  )
}

export default Settings


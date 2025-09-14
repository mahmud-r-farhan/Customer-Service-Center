import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { updateUserSettings } from "../redux/authSlice";
import { motion } from "framer-motion";
import { updateSettings, toggleTheme } from "../redux/settingsSlice";
import { Switch } from "../components/Switch";

function Settings() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }
    dispatch(updateUserSettings({ name, email }))
      .unwrap()
      .then(() => toast.success("Settings updated successfully"))
      .catch(() => toast.error("Failed to update settings"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 p-4 sm:p-6 lg:p-10"
    >
      <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent p-2">
        Settings
      </h1>

      {/* Profile Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Profile Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
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
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Save Changes
        </button>
      </form>

      {/* Settings Grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <Switch
              enabled={settings.theme === "dark"}
              onChange={() => dispatch(toggleTheme())}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Compact Mode</span>
            <Switch
              enabled={settings.compactMode || false}
              onChange={() =>
                dispatch(updateSettings({ compactMode: !settings.compactMode }))
              }
            />
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Sound Alerts</span>
            <Switch
              enabled={settings.soundEnabled}
              onChange={() =>
                dispatch(updateSettings({ soundEnabled: !settings.soundEnabled }))
              }
            />
          </div>
          <div className="flex items-center justify-between"
          title="DEMO"
          >
            <span className="text-gray-700 dark:text-gray-300">
              Desktop Notifications
            </span>
            <Switch
              enabled={settings.notifications}
              onChange={() =>
                dispatch(
                  updateSettings({ notifications: !settings.notifications })
                )
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Email Updates
            </span>
            <Switch
              enabled={settings.emailUpdates || false}
              onChange={() =>
                dispatch(updateSettings({ emailUpdates: !settings.emailUpdates }))
              }
            />
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6"
          title="DEMO"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Privacy & Security
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Two-Factor Authentication
            </span>
            <Switch
              enabled={settings.twoFactor || false}
              onChange={() =>
                dispatch(updateSettings({ twoFactor: !settings.twoFactor }))
              }
            />
          </div>
         
        </motion.div>

       {/* Account Preferences */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-6"
          title="DEMO"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account Preferences
          </h2>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={settings.language || "en"}
              onChange={(e) =>
                dispatch(updateSettings({ language: e.target.value }))
              }
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="es">Español (Spanish)</option>
              <option value="de">Deutsch (German)</option>
              <option value="fr">Français (French)</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="ru">Русский (Russian)</option>
              <option value="pt">Português (Portuguese)</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="ko">한국어 (Korean)</option>
              <option value="it">Italiano (Italian)</option>
              <option value="tr">Türkçe (Turkish)</option>
              <option value="pl">Polski (Polish)</option>
              <option value="nl">Nederlands (Dutch)</option>
              <option value="sv">Svenska (Swedish)</option>
              <option value="no">Norsk (Norwegian)</option>
              <option value="fi">Suomi (Finnish)</option>
              <option value="he">עברית (Hebrew)</option>
              <option value="th">ไทย (Thai)</option>
              <option value="vi">Tiếng Việt (Vietnamese)</option>
              <option value="id">Bahasa Indonesia (Indonesian)</option>
              <option value="cs">Čeština (Czech)</option>
              <option value="ro">Română (Romanian)</option>
              <option value="el">Ελληνικά (Greek)</option>
              <option value="hu">Magyar (Hungarian)</option>
            </select>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default Settings;
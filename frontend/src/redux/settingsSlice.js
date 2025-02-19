import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  theme: "light",
  notifications: true,
  soundEnabled: true,
  language: "en",
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("theme", state.theme)
    },
    updateSettings: (state, action) => {
      return { ...state, ...action.payload }
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled
    }
  },
})

export const { toggleTheme, updateSettings, toggleNotifications, toggleSound } = settingsSlice.actions
export default settingsSlice.reducer

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
  notifications: true,
  soundEnabled: true,
  language: "en",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    },
    updateSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { toggleTheme, updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
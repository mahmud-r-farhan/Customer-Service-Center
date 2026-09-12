import { createSlice } from "@reduxjs/toolkit";

function getStoredTheme() {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    // localStorage may be unavailable (e.g. privacy mode); fall back silently.
    return "light";
  }
}

const initialState = {
  theme: getStoredTheme(),
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
      try {
        localStorage.setItem("theme", state.theme);
      } catch {
        // Ignore storage errors (e.g. privacy mode / quota exceeded).
      }
      document.documentElement.classList.toggle("dark", state.theme === "dark");
    },
    updateSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { toggleTheme, updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
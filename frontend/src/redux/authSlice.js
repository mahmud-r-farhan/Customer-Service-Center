import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    // Do NOT store password or token in localStorage. Server sets HttpOnly cookie.
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed" });
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", { name, email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Registration failed" });
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  "auth/updateUserSettings",
  async ({ name, email, newEmail }, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/settings", { name, email, newEmail });
      // Server returns updated user; no sensitive data stored locally.
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update settings" });
    }
  }
);

export const verifyCredentials = createAsyncThunk(
  "auth/verifyCredentials",
  async (_, { rejectWithValue }) => {
    try {
      // Verify session by asking server for current user (cookie-based auth)
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Verification failed" });
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout");
    return { message: "Logged out" };
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Logout failed" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    // `loading` tracks in-flight login/register/settings requests (for button
    // spinners etc). `authChecked` tracks only the one-time initial session
    // check on app boot, so the full-page loader isn't re-shown (and the app
    // isn't unmounted/remounted, dropping the WebSocket connection) every
    // time an unrelated auth request like `updateUserSettings` is pending.
    loading: false,
    authChecked: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(verifyCredentials.rejected, (state, action) => {
        state.loading = false;
        state.authChecked = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });

    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
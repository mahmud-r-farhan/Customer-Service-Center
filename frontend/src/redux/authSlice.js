import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("email", email);
    localStorage.setItem("password", password); // Use sessionStorage for tab-specific storage
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
      localStorage.setItem("email", email);
      localStorage.setItem("password", password); // Use sessionStorage for tab-specific storage
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
      if (newEmail) {
        localStorage.setItem("email", newEmail); // Update email in storage
      }
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
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      if (!email || !password) {
        throw new Error("No credentials found");
      }
      const response = await api.post("/auth/verify", { email, password });
      return response.data;
    } catch (error) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      return rejectWithValue(error.response?.data || { message: "Verification failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: !!(localStorage.getItem("email") && localStorage.getItem("password")),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("email");
      localStorage.removeItem("password");
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
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(verifyCredentials.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
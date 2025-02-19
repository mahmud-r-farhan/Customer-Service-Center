import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from '../config/axios'

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    localStorage.setItem('token', response.data.token)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed" })
  }
})

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", { name, email, password })
      // Store token in localStorage
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Registration failed" })
    }
  }
)

export const updateUserSettings = createAsyncThunk(
  "auth/updateUserSettings",
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/auth/settings", { name, email })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    token: localStorage.getItem('token'),
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer


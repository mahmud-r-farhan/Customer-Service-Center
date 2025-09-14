import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";

// Fetch all clients
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/clients");
      const data = response.data;
      // Ensure it's always an array
      return Array.isArray(data) ? data : data.clients || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch clients" });
    }
  }
);

// Add a new client
export const addClient = createAsyncThunk(
  "clients/addClient",
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await api.post("/clients", clientData);
      return response.data; // single client object
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add client" });
    }
  }
);

// Update client status
export const updateClientStatus = createAsyncThunk(
  "clients/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/clients/${id}/status`, { status });
      return response.data; // single client object
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update status" });
    }
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    list: [], // always array
    loading: false,
    error: null,
    currentClient: null,
  },
  reducers: {
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    updateClients: (state, action) => {
      // manually replace full list
      state.list = Array.isArray(action.payload) ? action.payload : [];
    },
    updateSingleClient: (state, action) => {
      state.list = state.list.map((client) =>
        client._id === action.payload._id ? action.payload : client
      );
      if (state.currentClient?._id === action.payload._id) {
        state.currentClient = action.payload.status === "done" ? null : action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add client
      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [action.payload, ...state.list];
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update client status
      .addCase(updateClientStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClientStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((client) =>
          client._id === action.payload._id ? action.payload : client
        );
        if (state.currentClient?._id === action.payload._id) {
          state.currentClient = null;
        }
      })
      .addCase(updateClientStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentClient, clearCurrentClient, updateClients, updateSingleClient } = clientsSlice.actions;
export default clientsSlice.reducer;
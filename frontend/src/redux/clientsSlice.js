import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";

// Fetch all clients
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/clients");
      const data = response.data;
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add client" });
    }
  }
);

// Update client status
export const updateClientStatus = createAsyncThunk(
  "clients/updateStatus",
  async ({ id, status, agent }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/clients/${id}/status`, { status, agent });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update status" });
    }
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
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
      state.list = Array.isArray(action.payload) ? action.payload : [];
    },
    updateSingleClient: (state, action) => {
      const index = state.list.findIndex((client) => client._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      if (state.currentClient?._id === action.payload._id) {
        state.currentClient = action.payload.status === "done" ? null : action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // Add to beginning for new clients
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateClientStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClientStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((client) => client._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentClient?._id === action.payload._id) {
          if (action.payload.status === "done") {
            state.currentClient = null;
          } else {
            state.currentClient = action.payload;
          }
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
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/axios";


export const fetchClients = createAsyncThunk("clients/fetchClients", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/clients");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to fetch clients" });
  }
});


export const addClient = createAsyncThunk("clients/addClient", async (clientData, { rejectWithValue }) => {
  try {
    const response = await api.post("/clients", clientData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update client status
export const updateClientStatus = createAsyncThunk(
  "clients/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/clients/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update status");
    }
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    loading: false,
    error: null,
    currentClient: null
  },
  reducers: {
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    updateClients: (state, action) => { 
      state.list = action.payload;
    }
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
        state.list.push(action.payload);
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
        state.list = state.list.map(client =>
          client._id === action.payload._id ? action.payload : client
        );
        state.currentClient = null;
      })
      .addCase(updateClientStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentClient, clearCurrentClient, updateClients } = clientsSlice.actions;  // ✅ Export updateClients
export default clientsSlice.reducer;
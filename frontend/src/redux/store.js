import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clientsReducer from './clientsSlice';
import settingsReducer from './settingsSlice';
import { websocketMiddleware } from './websocketMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
});

export default store;
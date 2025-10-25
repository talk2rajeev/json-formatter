import { configureStore } from '@reduxjs/toolkit';
// Import your slice reducers here
import jsonReducer from '../slices/jsonSlice';

export const store = configureStore({
  reducer: {
    // Add your reducers here
    json: jsonReducer, 
  },
});

// Define Root State and Dispatch Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
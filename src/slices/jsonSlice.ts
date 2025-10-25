import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

export interface jsonObject {
    [key: string]: unknown
}

// 1. Define the type for the slice state
export interface JsonState {
  quickJsonEditor: Record<string, any>;
  jsonCompare: {
    leftJson: Record<string, any>;
    rightJson: Record<string, any>;
  } 
}

// 2. Define the initial state
const initialState: JsonState = {
  quickJsonEditor: {},
  jsonCompare: {
    leftJson: {},
    rightJson: {},
  }
};

// 3. Create the slice
export const jsonSlice = createSlice({
  name: 'JSON',
  initialState,
  reducers: {
    updateQuickJsonEditor: (state) => {
      // RTK uses Immer, so we can "mutate" the state directly
      state.quickJsonEditor = state.quickJsonEditor; 
    },
    updateLeftJson: (state, action: PayloadAction<Record<string, any>>) => {
      state.jsonCompare.leftJson = action.payload;
    },
    updateRightJson: (state, action: PayloadAction<Record<string, any>>) => {
      state.jsonCompare.rightJson = action.payload;
    },
    
  },
});

// 4. Export action creators and the reducer
export const { updateQuickJsonEditor, updateLeftJson, updateRightJson } = jsonSlice.actions;

// 5. Export selectors
export const selectQuickJsonEditor = (state: RootState): Record<string, any> => state.json.quickJsonEditor;
export const selectLeftJson = (state: RootState): Record<string, any> => state.json.jsonCompare.leftJson;
export const selectRightJson = (state: RootState): Record<string, any> => state.json.jsonCompare.rightJson;

export default jsonSlice.reducer;
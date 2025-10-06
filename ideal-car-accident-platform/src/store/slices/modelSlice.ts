import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AllocationModel } from '../../types'

interface ModelState {
  models: AllocationModel[];
  currentModel: AllocationModel | null;
  loading: boolean;
  error: string | null;
}

const initialState: ModelState = {
  models: [],
  currentModel: null,
  loading: false,
  error: null,
}

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setModels: (state, action: PayloadAction<AllocationModel[]>) => {
      state.models = action.payload;
    },
    setCurrentModel: (state, action: PayloadAction<AllocationModel | null>) => {
      state.currentModel = action.payload;
    },
    addModel: (state, action: PayloadAction<AllocationModel>) => {
      state.models.push(action.payload);
    },
    updateModel: (state, action: PayloadAction<AllocationModel>) => {
      const index = state.models.findIndex(model => model.id === action.payload.id);
      if (index !== -1) {
        state.models[index] = action.payload;
      }
    },
    deleteModel: (state, action: PayloadAction<string>) => {
      state.models = state.models.filter(model => model.id !== action.payload);
    },
  },
})

export const {
  setLoading,
  setError,
  setModels,
  setCurrentModel,
  addModel,
  updateModel,
  deleteModel,
} = modelSlice.actions

export default modelSlice.reducer
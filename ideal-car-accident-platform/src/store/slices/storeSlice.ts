import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Store } from '../../types'

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  currentStore: null,
  loading: false,
  error: null,
}

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
    },
    setCurrentStore: (state, action: PayloadAction<Store | null>) => {
      state.currentStore = action.payload;
    },
    addStore: (state, action: PayloadAction<Store>) => {
      state.stores.push(action.payload);
    },
    updateStore: (state, action: PayloadAction<Store>) => {
      const index = state.stores.findIndex(store => store.id === action.payload.id);
      if (index !== -1) {
        state.stores[index] = action.payload;
      }
    },
    deleteStore: (state, action: PayloadAction<string>) => {
      state.stores = state.stores.filter(store => store.id !== action.payload);
    },
  },
})

export const {
  setLoading,
  setError,
  setStores,
  setCurrentStore,
  addStore,
  updateStore,
  deleteStore,
} = storeSlice.actions

export default storeSlice.reducer
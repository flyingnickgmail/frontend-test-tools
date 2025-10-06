import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardStats, TrendData, StorePerformance } from '../../types'

interface DashboardState {
  stats: DashboardStats | null;
  trendData: TrendData[];
  storePerformance: StorePerformance[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  trendData: [],
  storePerformance: [],
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setTrendData: (state, action: PayloadAction<TrendData[]>) => {
      state.trendData = action.payload;
    },
    setStorePerformance: (state, action: PayloadAction<StorePerformance[]>) => {
      state.storePerformance = action.payload;
    },
  },
})

export const {
  setLoading,
  setError,
  setStats,
  setTrendData,
  setStorePerformance,
} = dashboardSlice.actions

export default dashboardSlice.reducer
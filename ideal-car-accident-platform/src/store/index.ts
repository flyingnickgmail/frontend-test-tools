import { configureStore } from '@reduxjs/toolkit'
import dashboardSlice from './slices/dashboardSlice'
import modelSlice from './slices/modelSlice'
import leadSlice from './slices/leadSlice'
import storeSlice from './slices/storeSlice'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
    model: modelSlice,
    lead: leadSlice,
    store: storeSlice,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
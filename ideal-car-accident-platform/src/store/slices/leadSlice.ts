import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Lead, AllocationResult } from '../../types'

interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  allocationResults: AllocationResult[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  currentLead: null,
  allocationResults: [],
  loading: false,
  error: null,
}

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
    },
    setCurrentLead: (state, action: PayloadAction<Lead | null>) => {
      state.currentLead = action.payload;
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state.leads.unshift(action.payload);
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    setAllocationResults: (state, action: PayloadAction<AllocationResult[]>) => {
      state.allocationResults = action.payload;
    },
    addAllocationResult: (state, action: PayloadAction<AllocationResult>) => {
      state.allocationResults.push(action.payload);
    },
  },
})

export const {
  setLoading,
  setError,
  setLeads,
  setCurrentLead,
  addLead,
  updateLead,
  setAllocationResults,
  addAllocationResult,
} = leadSlice.actions

export default leadSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './settings'

export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    value: "",
  },
  reducers: {
    setToken: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setToken } = tokenSlice.actions

export const tokenValue = (state: RootState) => state.token.value

export default tokenSlice.reducer

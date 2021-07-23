import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import authStatusReducer from './slices/authStatusSlice'
import loadingStatusReducer from './slices/loadingStatusSlice'
import employeesStatusReducer from './slices/employeesStatusSlice'
export const store = configureStore({
  reducer: {
    authStatus: authStatusReducer,
    loadingStatus: loadingStatusReducer,
    employeesStatus: employeesStatusReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import authStatusReducer from './slices/authStatusSlice'
import loadingStatusReducer from './slices/loadingStatusSlice'
import employeesStatusReducer from './slices/employeesStatusSlice'
import officeStatusReducer from './slices/officeStatusSlice'
import workPlacesReducer from './slices/workPlacesSlice'
import notificationsReducer from './slices/notificationsSlice'
import roomsReducer from './slices/roomsStatusSlice'
import newFurnitureReducer from './slices/newFurnitureSlice'
export const store = configureStore({
  reducer: {
    authStatus: authStatusReducer,
    loadingStatus: loadingStatusReducer,
    employeesStatus: employeesStatusReducer,
    officeStatus: officeStatusReducer,
    workPlaces: workPlacesReducer,
    notifications: notificationsReducer,
    roomsStatus: roomsReducer,
    newFurnitureStatus: newFurnitureReducer
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

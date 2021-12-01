import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { NewFurniture } from '../../types/newFurniture'

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: NewFurniture = {
  furnitureName: '',
  furnitureDetail: '',
  furnitureSize: 2,
  furnitureColor: 'white',
  isClose: false,
  authorities: [],
  updateInfo: false
}

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const newFurnitureSlice = createSlice({
  name: 'newFurniture',
  initialState,
  //reducer
  reducers: {
    setNewFurnitureName: (state, action: PayloadAction<string>) => {
      state.furnitureName = action.payload
    },
    setNewFurnitureDetail: (state, action: PayloadAction<string>) => {
      state.furnitureDetail = action.payload
    },
    setNewFurnitureSize: (state, action: PayloadAction<number>) => {
      state.furnitureSize = action.payload
    },
    setNewFurnitureColor: (
      state,
      action: PayloadAction<NewFurniture['furnitureColor']>
    ) => {
      state.furnitureColor = action.payload
    },
    setNewFurnitureIsClose: (state, action: PayloadAction<boolean>) => {
      state.isClose = action.payload
    },
    setNewFurnitureAuthorities: (state, action: PayloadAction<string[]>) => {
      state.authorities = action.payload
    },
    setUpdateFurniture: (state, action: PayloadAction<NewFurniture>) => {
      const updateFurniture = action.payload
      state.furnitureName = updateFurniture.furnitureName
      state.furnitureDetail = updateFurniture.furnitureDetail
      state.furnitureSize = updateFurniture.furnitureSize
      state.furnitureColor = updateFurniture.furnitureColor
      state.isClose = updateFurniture.isClose
      state.authorities = updateFurniture.authorities
      state.updateInfo = updateFurniture.updateInfo
    },
    setUpdatePosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      if (state.updateInfo) state.updateInfo.position = action.payload
    },

    clearNewFurniture: (state) => {
      state.furnitureName = ''
      state.furnitureDetail = ''
      state.furnitureSize = 2
      state.furnitureColor = 'white'
      state.isClose = false
      state.authorities = []
      state.updateInfo = false
    }
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const {
  setNewFurnitureName,
  setNewFurnitureDetail,
  setNewFurnitureSize,
  setNewFurnitureColor,
  setNewFurnitureIsClose,
  setNewFurnitureAuthorities,
  setUpdateFurniture,
  setUpdatePosition,
  clearNewFurniture
} = newFurnitureSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const newFurnitureSelector = (
  state: any /**RootStateが変 */
): NewFurniture => state.newFurnitureStatus

export const getFurnitureName = createSelector(
  newFurnitureSelector,
  (state) => state.furnitureName
)
export const getNewFurniture = createSelector(
  newFurnitureSelector,
  (state) => state
)
export const getNewFurnitureSize = createSelector(
  newFurnitureSelector,
  (state) => state.furnitureSize
)
export const getNewFurnitureColor = createSelector(
  newFurnitureSelector,
  (state) => state.furnitureColor
)
export const getNewFurnitureIsClose = createSelector(
  newFurnitureSelector,
  (state) => state.isClose
)
export const getNewFurnitureAuthorities = createSelector(
  newFurnitureSelector,
  (state) => state.authorities
)
export const getUpdateInfo = createSelector(
  newFurnitureSelector,
  (state) => state.updateInfo
)
//エクスポート
export default newFurnitureSlice.reducer

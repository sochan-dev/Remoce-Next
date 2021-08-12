import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import { auth, db, serverTimeStamp, firebaseTimeStamp } from '../../../firebase'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface NewFurniture {
  isCreate: boolean
  isDisplay: boolean
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  isClose: boolean
  authorities: string[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: NewFurniture = {
  isCreate: false,
  isDisplay: false,
  furnitureName: '',
  furnitureDetail: '',
  furnitureSize: 2,
  isClose: false,
  authorities: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

export const f = createAsyncThunk<boolean>('newFurnitureStatus/f', async () => {
  return false
})

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const newFurnitureSlice = createSlice({
  name: 'newFurniture',
  initialState,
  //reducer
  reducers: {
    setCreateDisplay: (state) => {
      state.isCreate = !state.isCreate
      state.isDisplay = !state.isDisplay
    },
    setNewFurnitureName: (state, action: PayloadAction<string>) => {
      state.furnitureName = action.payload
    },
    setNewFurnitureDetail: (state, action: PayloadAction<string>) => {
      state.furnitureDetail = action.payload
    },
    setNewFurnitureSize: (state, action: PayloadAction<number>) => {
      state.furnitureSize = action.payload
    },
    setNewFurnitureIsClose: (state, action: PayloadAction<boolean>) => {
      state.isClose = action.payload
    },
    setNewFurnitureAuthorities: (state, action: PayloadAction<string[]>) => {
      state.authorities = action.payload
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    //signUp関数
    builder
      .addCase(f.pending, (state, action) => {})
      .addCase(f.fulfilled, (state, action) => {})
      .addCase(f.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const {
  setCreateDisplay,
  setNewFurnitureName,
  setNewFurnitureDetail,
  setNewFurnitureSize,
  setNewFurnitureIsClose,
  setNewFurnitureAuthorities
} = newFurnitureSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const newFurnitureSelector = (state): NewFurniture =>
  state.newFurnitureStatus

export const getIsCreate = createSelector(
  newFurnitureSelector,
  (state) => state.isCreate
)
export const getIsDisplay = createSelector(
  newFurnitureSelector,
  (state) => state.isDisplay
)
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
export const getNewFurnitureIsClose = createSelector(
  newFurnitureSelector,
  (state) => state.isClose
)
export const getNewFurnitureAuthorities = createSelector(
  newFurnitureSelector,
  (state) => state.authorities
)

//エクスポート
export default newFurnitureSlice.reducer

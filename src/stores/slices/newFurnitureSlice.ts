import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import { auth, db, serverTimeStamp, firebaseTimeStamp } from '../../../firebase'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
export type FurnitureSize = 'small' | 'medium' | 'large'
//stateの初期値
export interface NewFurniture {
  isCreate: boolean
  furnitureName: string
  furnitureDetail: string
  furnitureSize: FurnitureSize
  isClose: boolean
  authorities: string[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: NewFurniture = {
  isCreate: false,
  furnitureName: '',
  furnitureDetail: '',
  furnitureSize: 'medium',
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
    setIsCreate: (state) => {
      state.isCreate = !state.isCreate
    },
    setNewFurnitureName: (state, action: PayloadAction<string>) => {
      state.furnitureName = action.payload
    },
    setNewFurnitureDetail: (state, action: PayloadAction<string>) => {
      state.furnitureDetail = action.payload
    },
    setNewFurnitureSize: (state, action: PayloadAction<FurnitureSize>) => {
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
  setIsCreate,
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

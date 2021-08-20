import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import { auth, db, serverTimeStamp, firebaseTimeStamp } from '../../../firebase'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface FurnitureStatus {
  furniture: {
    furnitureId: string
    roomId: string
    furnitureName: string
    furnitureDetail: string
    furnitureSize: number
    isClose: boolean
    authorities: string[]
    xCoordinate: number
    yCoordinate: number
    joinEmployees: string[]
  }[]
}

//signUp関数が受け取るuserの入力情報

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: FurnitureStatus = {
  furniture: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//サインアップ
export const f = createAsyncThunk<boolean>(
  'furnitureStatus/fetchRooms',
  async () => {
    return false
  }
)

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const furnitureStatusSlice = createSlice({
  name: 'furnitureStatus',
  initialState,
  //reducer
  reducers: {
    fetchFurniture: (
      state,
      action: PayloadAction<FurnitureStatus['furniture']>
    ) => {
      state.furniture = action.payload
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
export const { fetchFurniture } = furnitureStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const furnitureStatusSelector = (state): FurnitureStatus =>
  state.furnitureStatus

export const getFurniture = createSelector(
  furnitureStatusSelector,
  (state) => state.furniture
)

//エクスポート
export default furnitureStatusSlice.reducer

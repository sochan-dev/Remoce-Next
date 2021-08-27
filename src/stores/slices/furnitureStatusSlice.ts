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
    furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
    isClose: boolean
    authorities: string[]
    xCoordinate: number
    yCoordinate: number
    joinEmployees: string[]
  }[]
}

type Furniture_data = {
  roomId: string
  furniture_name: string
  furniture_detail: string
  furniture_size: number
  furniture_color: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  is_close: boolean
  authorities: string[]
  x_coordinate: number
  y_coordinate: number
  join_employees: string[]
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

//オブジェクト情報の取得
export const asyncFetchFurniture = createAsyncThunk<
  FurnitureStatus['furniture'],
  string
>('furnitureStatus/asyncFetchFurniture', async (officeId) => {
  const snapshots = await db
    .collection('offices')
    .doc(officeId)
    .collection('furniture')
    .get()

  const furnitureData: FurnitureStatus['furniture'] = []
  snapshots.forEach((snapshot) => {
    const furniture_data = snapshot.data() as Furniture_data
    furnitureData.push({
      furnitureId: snapshot.id,
      roomId: furniture_data.roomId,
      furnitureName: furniture_data.furniture_name,
      furnitureDetail: furniture_data.furniture_detail,
      furnitureSize: furniture_data.furniture_size,
      furnitureColor: furniture_data.furniture_color,
      isClose: furniture_data.is_close,
      authorities: furniture_data.authorities,
      xCoordinate: furniture_data.x_coordinate,
      yCoordinate: furniture_data.y_coordinate,
      joinEmployees: furniture_data.join_employees
    })
  })
  return furnitureData
})

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
      .addCase(asyncFetchFurniture.pending, (state, action) => {})
      .addCase(asyncFetchFurniture.fulfilled, (state, action) => {
        state.furniture = action.payload
      })
      .addCase(asyncFetchFurniture.rejected, (state, action) => {})
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

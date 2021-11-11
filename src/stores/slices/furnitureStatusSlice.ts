import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import { db } from '../../../firebase'
import { createSelector } from 'reselect'
import { FurnitureData, Furniture_data } from '../../types/furniture'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface FurnitureStatus {
  furniture: FurnitureData[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: FurnitureStatus = {
  furniture: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

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
      roomId: furniture_data.room_id,
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
export const furnitureStatusSelector = (
  state: any /**RootStateが変 */
): FurnitureStatus => state.furnitureStatus

export const getFurniture = createSelector(
  furnitureStatusSelector,
  (state) => state.furniture
)

//エクスポート
export default furnitureStatusSlice.reducer

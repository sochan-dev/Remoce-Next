import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '..'
import { db } from '../../../firebase'
import { createSelector } from 'reselect'
import { RoomData, Room_data } from '../../types/room'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface RoomsStatus {
  rooms: RoomData[]
}
type Rooms_data = {
  rooms: Room_data[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: RoomsStatus = {
  rooms: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//roomsの取得
export const asyncFetchRooms = createAsyncThunk<RoomsStatus['rooms'], string>(
  'roomsStatus/asyncFetchRooms',
  async (officeId) => {
    const snapshot = await db
      .collection('offices')
      .doc(officeId)
      .collection('room')
      .doc('room')
      .get()

    const rooms_data = snapshot.data() as Rooms_data
    const roomsData: RoomsStatus['rooms'] = []
    rooms_data.rooms.forEach((room_data) => {
      roomsData.push({
        roomId: room_data.room_id,
        xCoordinate: room_data.x_coordinate,
        yCoordinate: room_data.y_coordinate,
        joinEmployees: room_data.join_employees
      })
    })
    return roomsData
  }
)

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const roomsStatusSlice = createSlice({
  name: 'roomsStatus',
  initialState,
  //reducer
  reducers: {
    fetchRooms: (state, action: PayloadAction<RoomsStatus['rooms']>) => {
      state.rooms = action.payload
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    //signUp関数
    builder
      .addCase(asyncFetchRooms.pending, (state, action) => {})
      .addCase(asyncFetchRooms.fulfilled, (state, action) => {
        state.rooms = action.payload
      })
      .addCase(asyncFetchRooms.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { fetchRooms } = roomsStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const roomsStatusSelector = (
  state: any /**RootStateが変 */
): RoomsStatus => state.roomsStatus

export const getRooms = createSelector(
  roomsStatusSelector,
  (state) => state.rooms
)

//エクスポート
export default roomsStatusSlice.reducer

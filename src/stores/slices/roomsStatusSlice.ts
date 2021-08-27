import { EmployeesStatus } from './employeesStatusSlice'
import Router, { useRouter } from 'next/router'
import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk, RootState } from '..'
import { auth, db, serverTimeStamp, firebaseTimeStamp } from '../../../firebase'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface RoomsStatus {
  rooms: {
    roomId: string
    roomX: number
    roomY: number
    joinEmployees: string[]
  }[]
}

type Room_data = {
  room_id: string
  x_coordinate: number
  y_coordinate: number
  join_employees: string[]
}
type Rooms_data = {
  rooms: Room_data[]
}
//signUp関数が受け取るuserの入力情報

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
        roomX: room_data.x_coordinate,
        roomY: room_data.y_coordinate,
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
export const roomsStatusSelector = (state): RoomsStatus => state.roomsStatus

export const getRooms = createSelector(
  roomsStatusSelector,
  (state) => state.rooms
)

//エクスポート
export default roomsStatusSlice.reducer

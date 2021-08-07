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

//サインアップ
export const f = createAsyncThunk<boolean>(
  'roomsStatus/fetchRooms',
  async () => {
    return false
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
      .addCase(f.pending, (state, action) => {})
      .addCase(f.fulfilled, (state, action) => {})
      .addCase(f.rejected, (state, action) => {})
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

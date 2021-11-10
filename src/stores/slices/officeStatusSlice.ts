import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '..'
import { db } from '../../../firebase'
import { createSelector } from 'reselect'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
export interface OfficeStatus {
  officeId: string
  officeName: string
  officeWidth: number
  officeHeight: number
  employeeWidthRatio: number
  employeeHeightRatio: number
  scrollX: number
  scrollY: number
}
//signUp関数が受け取るuserの入力情報

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: OfficeStatus = {
  officeId: '',
  officeName: '',
  officeWidth: 0,
  officeHeight: 0,
  employeeWidthRatio: 0,
  employeeHeightRatio: 0,
  scrollX: 0,
  scrollY: 0
}

type FetchOfficePayload = {
  officeId: string
  officeName: string
}

type FetchOfficeSizePayload = {
  officeWidth: number
  officeHeight: number
}

type ScrollValue = { x: number; y: number }

type Office_data = {
  office_name: string
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//オフィス情報の取得
export const asyncFetchOffice = createAsyncThunk<FetchOfficePayload, string>(
  'officeStatus/asyncFetchOffice',
  async (officeId) => {
    const snapshot = await db.collection('offices').doc(officeId).get()
    const office_data = snapshot.data() as Office_data

    return {
      officeId: snapshot.id,
      officeName: office_data.office_name
    }
  }
)

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const officeStatusSlice = createSlice({
  name: 'officeStatus',
  initialState,
  //reducer
  reducers: {
    fetchOffice: (state, action: PayloadAction<FetchOfficePayload>) => {
      state.officeId = action.payload.officeId
      state.officeName = action.payload.officeName
    },
    fetchOfficeSize: (state, action: PayloadAction<FetchOfficeSizePayload>) => {
      const officeWidth = action.payload.officeWidth
      const officeHeight = action.payload.officeHeight
      state.officeWidth = officeWidth
      state.officeHeight = officeHeight
      /*
      state.employeeWidthRatio = Math.round((80 / officeWidth) * 100)
      state.employeeHeightRatio = Math.round((80 / officeHeight) * 100)
      */
    },
    setScrollValue: (state, action: PayloadAction<ScrollValue>) => {
      state.scrollX = Math.floor(action.payload.x)
      state.scrollY = Math.floor(action.payload.y)
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    //signUp関数
    builder
      .addCase(asyncFetchOffice.pending, (state, action) => {})
      .addCase(asyncFetchOffice.fulfilled, (state, action) => {
        state.officeId = action.payload.officeId
        state.officeName = action.payload.officeName
      })
      .addCase(asyncFetchOffice.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { fetchOffice, fetchOfficeSize, setScrollValue } =
  officeStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const officeSelector = (state: RootState): OfficeStatus =>
  state.officeStatus

export const getOffice = createSelector(officeSelector, (state) => state)
export const getOfficeId = createSelector(
  officeSelector,
  (state) => state.officeId
)
export const getOfficeSize = createSelector(officeSelector, (state) => {
  return { officeWidth: state.officeWidth, officeHeight: state.officeHeight }
})
export const getScrollValue = createSelector(officeSelector, (state) => {
  return {
    scrollX: state.scrollX,
    scrollY: state.scrollY
  }
})
//エクスポート
export default officeStatusSlice.reducer

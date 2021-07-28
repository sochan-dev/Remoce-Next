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

export type store = { workplaces: workPlaces }

export interface workPlaces {
  officeDataList: {
    employeeId: string
    employeeName: string
    officeId: string
    officeName: string
    officePicture?: string | false
  }[]
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: workPlaces = {
  officeDataList: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

export const f = createAsyncThunk<boolean>('workPlaces/fetchO', async () => {
  return false
})

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const workPlaceSlices = createSlice({
  name: 'workPlaces',
  initialState,
  //reducer
  reducers: {
    fetchWorkPlaces: (
      state,
      action: PayloadAction<workPlaces['officeDataList']>
    ) => {
      state.officeDataList = action.payload
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    builder
      .addCase(f.pending, (state, action) => {})
      .addCase(f.fulfilled, (state, action) => {})
      .addCase(f.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { fetchWorkPlaces } = workPlaceSlices.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const WorkPlaceSelector = (state): workPlaces[`officeDataList`] =>
  state.workPlaces.officeDataList

export const getWorkPlace = createSelector(WorkPlaceSelector, (state) => state)

//エクスポート
export default workPlaceSlices.reducer

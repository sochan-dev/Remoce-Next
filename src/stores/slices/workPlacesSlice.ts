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

export type store = { workplaces: WorkPlaces }

export interface WorkPlaces {
  officeDataList: {
    employeeId: string
    employeeName: string
    officeId: string
    officeName: string
    officePicture?: string | false
  }[]
}

type Employee_data = {
  employee_id: string
  employee_name: string
  office_id: string
}

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: WorkPlaces = {
  officeDataList: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

export const asyncFetchWorkPlaces = createAsyncThunk<
  WorkPlaces['officeDataList'],
  string
>('workPlaces/asyncFetchWorkPlaces', async (userId) => {
  const belongOfficeList: WorkPlaces['officeDataList'] = []
  await db
    .collection('users')
    .doc(userId)
    .collection('employee_to_office')
    .get()
    .then(async (snapshot) => {
      if (!snapshot.empty) {
        for await (let childSnapshot of snapshot.docs) {
          const employee = childSnapshot.data() as Employee_data
          await db
            .collection('offices')
            .doc(employee.office_id)
            .get()
            .then((snapshot) => {
              belongOfficeList.push({
                employeeId: employee.employee_id,
                employeeName: employee.employee_name,
                officeId: employee.office_id,
                officeName: snapshot.data().office_name,
                officePicture: snapshot.data().office_picture
                  ? snapshot.data().office_picture
                  : false
              })
            })
        }
      }
    })
  return belongOfficeList
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
      action: PayloadAction<WorkPlaces['officeDataList']>
    ) => {
      state.officeDataList = action.payload
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchWorkPlaces.pending, (state, action) => {})
      .addCase(asyncFetchWorkPlaces.fulfilled, (state, action) => {
        state.officeDataList = action.payload
      })
      .addCase(asyncFetchWorkPlaces.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const { fetchWorkPlaces } = workPlaceSlices.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const WorkPlaceSelector = (state): WorkPlaces[`officeDataList`] =>
  state.workPlaces.officeDataList

export const getWorkPlace = createSelector(WorkPlaceSelector, (state) => state)

//エクスポート
export default workPlaceSlices.reducer

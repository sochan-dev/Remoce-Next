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
export interface EmployeesStatus {
  yourId: string
  employees: {
    employeeId: string
    employeeName: string
    xCoordinate: number
    yCoordinate: number
  }[]
}

type Employee = {
  id: number
  employeeData: {
    employeeId: string
    employeeName: string
    xCoordinate: number
    yCoordinate: number
  }
}
//signUp関数が受け取るuserの入力情報

/*////////////////////////////////////////////////
  stateの初期値
/*/ ///////////////////////////////////////////////
const initialState: EmployeesStatus = {
  yourId: '',
  employees: []
}

/*////////////////////////////////////////////////
  createAsyncThunk
/*/ ///////////////////////////////////////////////

//サインアップ
export const f = createAsyncThunk<boolean>(
  'employeeStatus/fetchEmployees',
  async () => {
    return false
  }
)

/*////////////////////////////////////////////////
  createSlice
/*/ ///////////////////////////////////////////////
export const employeesStatusSlice = createSlice({
  name: 'employeesStatus',
  initialState,
  //reducer
  reducers: {
    fetchEmployeesStatus: (state, action: PayloadAction<EmployeesStatus>) => {
      state.yourId = action.payload.yourId
      state.employees = action.payload.employees
    },
    fetchEmployees: (
      state,
      action: PayloadAction<EmployeesStatus['employees']>
    ) => {
      state.employees = action.payload
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees[action.payload.id] = action.payload.employeeData
    },
    addEmployee: (state, action: PayloadAction<Employee['employeeData']>) => {
      console.log('store側', action.payload)
      state.employees.push(action.payload)
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
  fetchEmployeesStatus,
  fetchEmployees,
  updateEmployee,
  addEmployee
} = employeesStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const EmployeesStatusSelector = (state): EmployeesStatus =>
  state.employeesStatus

export const getEmployeesStatus = createSelector(
  EmployeesStatusSelector,
  (state) => state
)

export const getEmployeeId = createSelector(
  EmployeesStatusSelector,
  (state) => state.yourId
)

export const getEmployees = createSelector(
  EmployeesStatusSelector,
  (state) => state.employees
)
//エクスポート
export default employeesStatusSlice.reducer

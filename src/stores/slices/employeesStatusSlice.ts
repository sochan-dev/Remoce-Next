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
    employeePicture: string
    editPermission: boolean
    xCoordinate: number
    yCoordinate: number
  }[]
}

type UpdateEmployee = {
  id: number
  employeeData: {
    employeeId: string
    employeeName: string
    employeePicture: string
    editPermission: boolean
    xCoordinate: number
    yCoordinate: number
  }
}

type Employee = {
  employeeName: string
  xCoordinate: number
  yCoordinate: number
}

type Employee_data = {
  employee_name: string
  employee_picture: string
  edit_permission: boolean
  employee_x_coordinate: number
  employee_y_coordinate: number
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

//社員情報の取得
export const asyncFetchEmployees = createAsyncThunk<
  EmployeesStatus['employees'],
  string
>('employeeStatus/asyncFetchEmployees', async (officeId) => {
  const snapshots = await db
    .collection('offices')
    .doc(officeId)
    .collection('employees')
    .get()

  const employeesData: EmployeesStatus['employees'] = []
  snapshots.forEach((snapshot) => {
    const employeeData = snapshot.data() as Employee_data
    employeesData.push({
      employeeId: snapshot.id,
      employeeName: employeeData.employee_name,
      employeePicture: employeeData.employee_picture,
      editPermission: employeeData.edit_permission,
      xCoordinate: employeeData.employee_x_coordinate,
      yCoordinate: employeeData.employee_y_coordinate
    })
  })

  return employeesData
})

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
      console.log('permissionTest', action.payload)
      state.employees = action.payload
    },
    updateEmployee: (state, action: PayloadAction<UpdateEmployee>) => {
      state.employees[action.payload.id] = action.payload.employeeData
    },
    updateOwnEmployee: (state, action: PayloadAction<Employee>) => {
      const newOwnEmployee = action.payload

      state.employees = state.employees.map((employee) => {
        return employee.employeeId === state.yourId
          ? employee
          : { ...employee, employeeName: newOwnEmployee.employeeName }
      })
    },
    addEmployee: (
      state,
      action: PayloadAction<UpdateEmployee['employeeData']>
    ) => {
      console.log('store側', action.payload)
      state.employees.push(action.payload)
    }
  },
  //AsyncThunkを扱うreducer
  extraReducers: (builder) => {
    //signUp関数
    builder
      .addCase(asyncFetchEmployees.pending, (state, action) => {})
      .addCase(asyncFetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload
      })
      .addCase(asyncFetchEmployees.rejected, (state, action) => {})
  }
})
/*////////////////////////////////////////////////
  Actions
/*/ ///////////////////////////////////////////////
export const {
  fetchEmployeesStatus,
  fetchEmployees,
  updateEmployee,
  updateOwnEmployee,
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

export const getOwnEmployeeData = createSelector(
  EmployeesStatusSelector,
  (state) => {
    const myId = state.yourId
    return state.employees.filter((employee) => employee.employeeId === myId)[0]
  }
)

export const getEmployees = createSelector(
  EmployeesStatusSelector,
  (state) => state.employees
)

export const getEditPermission = createSelector(
  EmployeesStatusSelector,
  (state) => {
    const myId = state.yourId

    return state.employees.filter((employee) => employee.employeeId === myId)[0]
      .editPermission
  }
)
//エクスポート
export default employeesStatusSlice.reducer

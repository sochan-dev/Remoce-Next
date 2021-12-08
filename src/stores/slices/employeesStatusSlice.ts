import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..'
import { db } from '../../../firebase'
import { createSelector } from 'reselect'
import { EmployeeData, Employee_data } from '../../types/employee'

/*////////////////////////////////////////////////
  型宣言
/*/ ///////////////////////////////////////////////
//stateの初期値
interface EmployeesStatus {
  yourId: string
  employees: EmployeeData[]
}

type UpdateEmployee = {
  id: number
  employeeData: EmployeeData
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
    .where('is_office', '==', true)
    .get()

  const employeesList: EmployeesStatus['employees'] = []
  snapshots.forEach((snapshot) => {
    const employeeData = snapshot.data() as Employee_data
    employeesList.push({
      employeeId: snapshot.id,
      employeeName: employeeData.employee_name,
      employeePicture: employeeData.employee_picture,
      editPermission: employeeData.edit_permission,
      xCoordinate: employeeData.employee_x_coordinate,
      yCoordinate: employeeData.employee_y_coordinate
    })
  })

  return employeesList
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
    fetchEmployeeId: (state, action: PayloadAction<string>) => {
      state.yourId = action.payload
    },
    fetchEmployees: (
      state,
      action: PayloadAction<EmployeesStatus['employees']>
    ) => {
      state.employees = action.payload
    },
    updateEmployee: (state, action: PayloadAction<UpdateEmployee>) => {
      state.employees.forEach((employee, i) => {
        if (employee.employeeId === action.payload.employeeData.employeeId) {
          state.employees[i] = action.payload.employeeData
        }
      })
    },
    updateOwnEmployee: (
      state,
      action: PayloadAction<
        Pick<EmployeeData, 'employeeName' | 'xCoordinate' | 'yCoordinate'>
      >
    ) => {
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
  fetchEmployeeId,
  fetchEmployees,
  updateEmployee,
  updateOwnEmployee,
  addEmployee
} = employeesStatusSlice.actions

/*////////////////////////////////////////////////
  Selector
/*/ ///////////////////////////////////////////////
export const EmployeesStatusSelector = (
  state: any /**RootStateが変 */
): EmployeesStatus => state.employeesStatus

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

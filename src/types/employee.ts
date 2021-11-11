export interface EmployeeData {
  employeeId: string
  employeeName: string
  employeePicture: string
  editPermission: boolean
  xCoordinate: number
  yCoordinate: number
}

//store/employeesStatusSlice
//pages/office/[employee_id]
export interface Employee_data {
  employee_name: string
  employee_picture: string
  edit_permission: boolean
  employee_x_coordinate: number
  employee_y_coordinate: number
}

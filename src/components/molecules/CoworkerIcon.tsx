import React, { VFC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { db } from '../../../firebase'
import { updateEmployee } from '../../stores/slices/employeesStatusSlice'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Styles from '../../../styles/sass/employeeIcon.module.scss'

type props = {
  id: number
  officeId: string
  employeeData: {
    employeeId: string
    employeeName: string
    xCoordinate: number
    yCoordinate: number
  }
  officeSize: {
    officeWidth: number
    officeHeight: number
  }
}

type Employee_data = {
  employee_id: string
  employee_name: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type EmployeeData = {
  employeeId: string
  employeeName: string
  xCoordinate: number
  yCoordinate: number
}

const CoworkerIcon: VFC<props> = (props) => {
  const dispatch = useDispatch()
  const { id, officeId, employeeData, officeSize } = props
  const initialCoordinate = {
    left: employeeData.xCoordinate * Math.round(officeSize.officeWidth / 100),
    top: employeeData.yCoordinate * Math.round(officeSize.officeHeight / 100)
  }

  useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(employeeData.employeeId)
      .onSnapshot((doc) => {
        console.log('発火してる')
        const employee = doc.data() as Employee_data

        console.log('coworker_employee', employee)
        const employeeData: EmployeeData = {
          employeeId: doc.id,
          employeeName: employee.employee_name,
          xCoordinate: employee.employee_x_coordinate,
          yCoordinate: employee.employee_y_coordinate
        }
        console.log('employee', employee)
        dispatch(updateEmployee({ id: id, employeeData: employeeData }))
      })

    return unsubscribe
  }, [])
  return (
    <div className={Styles.coworker} style={initialCoordinate}>
      <AccountCircleIcon className={Styles.icon} />
    </div>
  )
}

export default CoworkerIcon

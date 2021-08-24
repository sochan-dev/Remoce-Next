import React, { VFC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { db } from '../../../firebase'
import { updateEmployee } from '../../stores/slices/employeesStatusSlice'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Styles from '../../../styles/sass/employeeIcon.module.scss'

type props = {
  id: number
  officeId: string
  ownData: {
    employeeId: string
    employeeName: string
    employeePicture: string
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
  employee_picture: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type EmployeeData = {
  employeeId: string
  employeeName: string
  employeePicture: string
  xCoordinate: number
  yCoordinate: number
}

const CoworkerIcon: VFC<props> = (props) => {
  const dispatch = useDispatch()
  const { id, officeId, ownData } = props
  const initialCoordinate = {
    left: ownData.xCoordinate,
    top: ownData.yCoordinate
  }

  useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(ownData.employeeId)
      .onSnapshot((doc) => {
        const employee = doc.data() as Employee_data
        const employeeData: EmployeeData = {
          employeeId: doc.id,
          employeeName: employee.employee_name,
          employeePicture: employee.employee_picture,
          xCoordinate: employee.employee_x_coordinate,
          yCoordinate: employee.employee_y_coordinate
        }

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

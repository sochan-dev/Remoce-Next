import React, { VFC } from 'react'
import { EmployeeData } from '../../types/employee'
import { useDeportEmployee } from './hooks'

type props = Pick<EmployeeData, 'employeeId' | 'employeeName'>

const DeportEmployee: VFC<props> = (props) => {
  const { employeeId, employeeName } = props
  const handleOnClick = useDeportEmployee(employeeId, employeeName)

  return <p onClick={() => handleOnClick()}>{employeeName}</p>
}

export default DeportEmployee

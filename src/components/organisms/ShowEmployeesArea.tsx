import React, { VFC } from 'react'
import { useSelector } from 'react-redux'
import { getEmployees } from '../../stores/slices/employeesStatusSlice'
import { EmployeeIcon } from '../molecules'

const ShowEmployeesArea: VFC = () => {
  const employees = useSelector(getEmployees)
  return (
    <div>
      {employees.map((employee, i) => (
        <EmployeeIcon key={i} />
      ))}
    </div>
  )
}

export default ShowEmployeesArea

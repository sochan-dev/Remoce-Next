import React, { VFC, useState } from 'react'
import { useSelector } from 'react-redux'
import { getEmployeesStatus } from '../../stores/slices/employeesStatusSlice'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'
import { CoworkerIcon } from '../molecules'
import { MyIcon } from '../organisms'

const ShowEmployeesArea: VFC = () => {
  const selector = useSelector((state) => state)
  const { employees, yourId } = getEmployeesStatus(selector)
  const [isDrag, setIsDrag] = useState(false)
  const officeId = getOfficeId(selector)
  return (
    <>
      {employees.map((employee, i) =>
        employee.employeeId === yourId ? (
          <MyIcon
            key={employee.employeeId}
            id={i}
            officeId={officeId}
            ownData={employee}
            isDrag={isDrag}
            setIsDrag={setIsDrag}
          />
        ) : (
          <CoworkerIcon
            key={employee.employeeId}
            id={i}
            officeId={officeId}
            ownData={employee}
            isDrag={isDrag}
            setIsDrag={setIsDrag}
          />
        )
      )}
    </>
  )
}

export default ShowEmployeesArea

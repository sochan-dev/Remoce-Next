import React, { VFC, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getEmployees } from '../../stores/slices/employeesStatusSlice'
import {
  getOfficeId,
  getOfficeSize
} from '../../stores/slices/officeStatusSlice'
import { CoworkerIcon } from '../molecules'
import { MyIcon } from '../organisms'

const ShowEmployeesArea: VFC = () => {
  console.log('ShowEmployeesArea再レンダリング')
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const { employees, yourId } = getEmployees(selector)
  const officeId = getOfficeId(selector)
  const officeSize = getOfficeSize(selector)

  return (
    <>
      {employees.map((employee, i) =>
        employee.employeeId === yourId ? (
          <MyIcon
            key={i}
            id={i}
            officeId={officeId}
            employeeData={employee}
            officeSize={officeSize}
          />
        ) : (
          <CoworkerIcon
            key={i}
            id={i}
            officeId={officeId}
            employeeData={employee}
            officeSize={officeSize}
          />
        )
      )}
    </>
  )
}

export default ShowEmployeesArea

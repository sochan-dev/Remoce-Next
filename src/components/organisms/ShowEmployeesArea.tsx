import React, { VFC, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getEmployeesStatus } from '../../stores/slices/employeesStatusSlice'
import {
  getOfficeId,
  getOfficeSize
} from '../../stores/slices/officeStatusSlice'
import { CoworkerIcon } from '../molecules'
import { MyIcon } from '../organisms'

const ShowEmployeesArea: VFC = () => {
  const selector = useSelector((state) => state)
  const { employees, yourId } = getEmployeesStatus(selector)
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
            ownData={employee}
            officeSize={officeSize}
          />
        ) : (
          <CoworkerIcon
            key={i}
            id={i}
            officeId={officeId}
            ownData={employee}
            officeSize={officeSize}
          />
        )
      )}
    </>
  )
}

export default ShowEmployeesArea

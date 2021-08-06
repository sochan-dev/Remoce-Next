import React, { VFC, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getEmployeesStatus } from '../../stores/slices/employeesStatusSlice'
import {
  getOfficeId,
  getOfficeSize
} from '../../stores/slices/officeStatusSlice'
import { getRooms } from '../../stores/slices/roomsStatusSlice'
import { CoworkerIcon } from '../molecules'
import { MyIcon } from '../organisms'
import { Room } from '../molecules'

const ShowEmployeesArea: VFC = () => {
  console.log('ShowEmployeesArea再レンダリング')
  const selector = useSelector((state) => state)
  const { employees, yourId } = getEmployeesStatus(selector)
  const rooms = getRooms(selector)
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
      {rooms.map((room, i) => (
        <Room
          key={i}
          roomId={room.roomId}
          roomX={room.roomX}
          roomY={room.roomY}
        />
      ))}
    </>
  )
}

export default ShowEmployeesArea

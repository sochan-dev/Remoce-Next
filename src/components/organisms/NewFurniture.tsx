import React, { VFC, useRef } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../../firebase'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { getEmployees } from '../../stores/slices/employeesStatusSlice'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { ICONSIZE, SENSORSIZE } from '../../utils/iconSize'
import Styles from '../../../styles/sass/employeeIcon.module.scss'
import { getRooms } from '../../stores/slices/roomsStatusSlice'
import axios from 'axios'

type props = {
  id: number
  officeId: string
  ownData: {
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

type OverlapEmployee = {
  employeeId: string
  halfwayPointX: number
  halfwayPointY: number
}

type PostRequest = {
  officeId: string
  joinEmployees: string[]
  roomX: number
  roomY: number
}

type PutRequest = {
  officeId: string
  employeeId: string
  overlapRoomIds: string[] | false
}

const NewFurniture: VFC<props> = (props) => {
  const selector = useSelector((state) => state)
  const URL =
    'http://localhost:5001/remoce-7a22f/asia-northeast1/remoce/furniture'
  const employees = getEmployees(selector)
  const rooms = getRooms(selector)
  const { officeId, ownData } = props
  const draggableRef = useRef(null)
  const initialCoordinate = {
    left: ownData.xCoordinate,
    top: ownData.yCoordinate
  }

  ///////////////////////////////////////////////////////
  /********************　座標の更新　****************** */
  const fsUpdateCoordinate = async (
    xCoordinate: number,
    yCoordinate: number
  ): Promise<boolean> => {
    let isSuccess: boolean
    await db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(ownData.employeeId)
      .update({
        employee_x_coordinate: xCoordinate,
        employee_y_coordinate: yCoordinate
      })
      .then(() => {
        isSuccess = true
      })
      .catch(() => {
        isSuccess = false
      })
    return isSuccess
  }

  /********************　roomとの重なりを判定　****************** */
  const judgeOverlapRoom = (
    xCoordinate: number,
    yCoordinate: number
  ): string[] => {
    let overlapRoomIds: string[] = []
    const ownStartX = xCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
    const ownStartY = yCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
    const ownEndX = ownStartX + ICONSIZE
    const ownEndY = ownStartY + ICONSIZE

    rooms.forEach((room) => {
      const roomStartX = room.roomX
      const roomStartY = room.roomY
      const roomEndX = roomStartX + SENSORSIZE + 20
      const roomEndY = roomStartY + SENSORSIZE + 20

      if (
        ((ownStartX <= roomStartX && roomStartX <= ownEndX) ||
          (roomEndX <= ownEndX && ownStartX <= roomEndX) ||
          (roomStartX <= ownStartX && ownEndX <= roomEndX)) &&
        ((ownStartY <= roomStartY && roomStartY <= ownEndY) ||
          (roomEndY <= ownEndY && ownStartY <= roomEndY) ||
          (roomStartY <= ownStartY && ownEndY <= roomEndY))
      ) {
        overlapRoomIds.push(room.roomId)
      }
    })
    return overlapRoomIds
  }

  /********************　employeeとの重なりを判定　****************** */
  const judgeOverLapEmployee = (
    xCoordinate: number,
    yCoordinate: number
  ): OverlapEmployee[] | false => {
    let overlapEmployees: OverlapEmployee[] = []
    const sensorStartX = xCoordinate
    const sensorStartY = yCoordinate
    const sensorEndX = sensorStartX + SENSORSIZE
    const sensorEndY = sensorStartY + SENSORSIZE
    employees.forEach((employee) => {
      if (ownData.employeeId !== employee.employeeId) {
        const employeeStartX = employee.xCoordinate
        const employeeStartY = employee.yCoordinate
        const employeeEndX = employeeStartX + SENSORSIZE
        const employeeEndY = employeeStartY + SENSORSIZE

        if (
          ((sensorStartX <= employeeStartX && employeeStartX <= sensorEndX) ||
            (sensorStartX <= employeeEndX && employeeEndX <= sensorEndX)) &&
          ((sensorStartY <= employeeStartY && employeeStartY <= sensorEndY) ||
            (sensorStartY <= employeeEndY && employeeEndY <= sensorEndY))
        ) {
          console.log('employeeと重なった')
          const halfwayPointX = Math.round((sensorStartX + employeeStartX) / 2)
          const halfwayPointY = Math.round((sensorStartY + employeeStartY) / 2)
          const overlapEmployee: OverlapEmployee = {
            employeeId: employee.employeeId,
            halfwayPointX: halfwayPointX,
            halfwayPointY: halfwayPointY
          }
          overlapEmployees.push(overlapEmployee)
        }
      }
    })
    return overlapEmployees.length > 0 ? overlapEmployees : false
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    const xCoordinate = initialCoordinate.left + data.lastX //自身のX座標
    const yCoordinate = initialCoordinate.top + data.lastY //自身のY座標

    fsUpdateCoordinate(xCoordinate, yCoordinate) //座標の更新
    const overlapRoomIds = judgeOverlapRoom(xCoordinate, yCoordinate) //自身と重なってるroomのidを一括取得
    console.log('overlapRoomids', overlapRoomIds)

    if (overlapRoomIds.length === 0) {
      //どのroomとも重なっていない
      const overlapEmployees = judgeOverLapEmployee(xCoordinate, yCoordinate) //自身と重なっているemployeeを一括取得
      if (overlapEmployees) {
        //重なっているemployeeがいる

        for (let overlapEmployee of overlapEmployees) {
          //重なっている人数分room作成のリクエストする。
          const req: PostRequest = {
            officeId: officeId,
            joinEmployees: [ownData.employeeId, overlapEmployee.employeeId],
            roomX: overlapEmployee.halfwayPointX,
            roomY: overlapEmployee.halfwayPointY
          }
          const reqJSON = JSON.stringify(req)
          let params = new URLSearchParams()
          params.append('data', reqJSON)
          axios.post(URL, params)
        }
      } else {
        //重なっているemployeeがいないのでroom情報のみ更新
        const req: PutRequest = {
          officeId: officeId,
          employeeId: ownData.employeeId,
          overlapRoomIds: false
        }
        const reqJSON = JSON.stringify(req)
        let params = new URLSearchParams()
        params.append('data', reqJSON)
        axios.put(URL, params).then((res) => {
          const d = res.data
          console.log(d)
        })
      }
    } else {
      //roomと重なっているので、重なったroom情報に自分のIDを追加
      const req: PutRequest = {
        officeId: officeId,
        employeeId: ownData.employeeId,
        overlapRoomIds: overlapRoomIds
      }
      const reqJSON = JSON.stringify(req)
      let params = new URLSearchParams()
      params.append('data', reqJSON)
      axios.put(URL, params)
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Draggable nodeRef={draggableRef} onStop={handleStop} bounds="parent">
      <div ref={draggableRef} className={Styles.mine} style={initialCoordinate}>
        <AccountCircleIcon className={Styles.icon} />
      </div>
    </Draggable>
  )
}

export default NewFurniture

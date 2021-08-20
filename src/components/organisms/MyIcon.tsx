import React, { VFC, useRef } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../../firebase'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { getEmployees } from '../../stores/slices/employeesStatusSlice'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { ICONSIZE, SENSORSIZE, OBJECTSIZE } from './utils/iconSize'
import Styles from '../../../styles/sass/employeeIcon.module.scss'
import { getRooms } from '../../stores/slices/roomsStatusSlice'
import axios from 'axios'
import { getFurniture } from '../../stores/slices/furnitureStatusSlice'
import { judgeLargerTarget } from './utils/judgeOverlap'

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

type RoomPostRequest = {
  officeId: string
  joinEmployees: string[]
  roomX: number
  roomY: number
}

type RoomPutRequest = {
  officeId: string
  employeeId: string
  overlapRoomIds: string[] | false
}

type FurnitureRequest = {
  officeId: string
  employeeId: string
  furnitureId: string | string[]
}

const MyIcon: VFC<props> = (props) => {
  console.log('MyIcon再レンダリング')
  const selector = useSelector((state) => state)
  const URL = 'http://localhost:5001/remoce-7a22f/asia-northeast1/remoce/'
  const employees = getEmployees(selector)
  const rooms = getRooms(selector)
  const furnitureList = getFurniture(selector)
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
  /********************　現stateでfurnitureに所属しているか判定　****************** */
  const judgeJoinFurniture = () => {
    let joinFurnitureList: string[] = []
    furnitureList.forEach((furniture) => {
      furniture.joinEmployees.forEach((joinEmployee) => {
        if (ownData.employeeId === joinEmployee) {
          joinFurnitureList.push(furniture.furnitureId)
        }
      })
    })
    return joinFurnitureList
  }
  /********************　重なったemployee（Coworker）がFurnitureと重なっているか判定　****************** */
  const judgeEmployeeOverlapFurniture = (employeeId: string) => {
    let isOverlap = false
    for (let furniture of furnitureList) {
      if (isOverlap) continue
      furniture.joinEmployees.forEach((joinEmployeeId) => {
        if (joinEmployeeId === employeeId) isOverlap = true
      })
    }
    return isOverlap
  }

  /********************　furnitureとの重なりを判定　****************** */
  const judgeOverlapFurniture = (
    xCoordinate: number,
    yCoordinate: number
  ): string | false => {
    let overlapFurnitureId: string | false = false
    const ownStartX = xCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
    const ownStartY = yCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
    const ownEndX = ownStartX + ICONSIZE
    const ownEndY = ownStartY + ICONSIZE
    const ownInfo = {
      ownStartX: ownStartX,
      ownStartY: ownStartY,
      ownEndX: ownEndX,
      ownEndY: ownEndY
    }

    for (let furniture of furnitureList) {
      if (overlapFurnitureId) break
      const targetInfo = {
        xCoordinate: furniture.xCoordinate,
        yCoordinate: furniture.yCoordinate,
        size: furniture.furnitureSize * OBJECTSIZE
      }
      if (judgeLargerTarget(ownInfo, targetInfo)) {
        overlapFurnitureId = furniture.furnitureId
      }
    }
    return overlapFurnitureId
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
    const overlapFurnitureId = judgeOverlapFurniture(xCoordinate, yCoordinate) //自身と重なっているfurnitureのIDを取得
    if (overlapFurnitureId) {
      //furnitureと重なっている
      //roomのjoinEmployeesから自身のIDを削除
      const roomReq: RoomPutRequest = {
        officeId: officeId,
        employeeId: ownData.employeeId,
        overlapRoomIds: false
      }
      const roomReqJSON = JSON.stringify(roomReq)
      let roomParams = new URLSearchParams()
      roomParams.append('data', roomReqJSON)
      axios.put(`${URL}room`, roomParams)
      //furnitureのjoinEmployeesに自身のIDを追加
      const furnitureReq: FurnitureRequest = {
        officeId: officeId,
        employeeId: ownData.employeeId,
        furnitureId: overlapFurnitureId
      }
      const furnitureReqJSON = JSON.stringify(furnitureReq)
      let furnitureParams = new URLSearchParams()
      furnitureParams.append('data', furnitureReqJSON)
      axios.put(`${URL}furniture`, furnitureParams)
    } else {
      //furnitureと重なっていない
      const joinFurnitureList = judgeJoinFurniture()
      if (joinFurnitureList.length > 0) {
        const furnitureReq: FurnitureRequest = {
          officeId: officeId,
          employeeId: ownData.employeeId,
          furnitureId: joinFurnitureList
        }
        const furnitureReqJSON = JSON.stringify(furnitureReq)
        let furnitureParams = new URLSearchParams()
        furnitureParams.append('data', furnitureReqJSON)
        axios.put(`${URL}furniture`, furnitureParams)
      }
      //room処理開始
      const overlapRoomIds = judgeOverlapRoom(xCoordinate, yCoordinate) //自身と重なってるroomのidを一括取得
      if (overlapRoomIds.length === 0) {
        //どのroomとも重なっていない
        const overlapEmployees = judgeOverLapEmployee(xCoordinate, yCoordinate) //自身と重なっているemployeeを一括取得
        if (overlapEmployees) {
          //重なっているemployeeがいる

          for (let overlapEmployee of overlapEmployees) {
            //ここで重なってるEmployeeがFurnitureに所属していないか確認。していたらcontinue
            if (judgeEmployeeOverlapFurniture(overlapEmployee.employeeId)) {
              continue
            }
            //重なっている人数分room作成のリクエストする。
            const req: RoomPostRequest = {
              officeId: officeId,
              joinEmployees: [ownData.employeeId, overlapEmployee.employeeId],
              roomX: overlapEmployee.halfwayPointX,
              roomY: overlapEmployee.halfwayPointY
            }
            const reqJSON = JSON.stringify(req)
            let params = new URLSearchParams()
            params.append('data', reqJSON)
            axios.post(`${URL}room`, params)
          }
        } else {
          //重なっているemployeeがいないのでroom情報のみ更新
          const req: RoomPutRequest = {
            officeId: officeId,
            employeeId: ownData.employeeId,
            overlapRoomIds: false
          }
          const reqJSON = JSON.stringify(req)
          let params = new URLSearchParams()
          params.append('data', reqJSON)
          axios.put(`${URL}room`, params).then((res) => {
            const d = res.data
            console.log(d)
          })
        }
      } else {
        //roomと重なっているので、重なったroom情報に自分のIDを追加
        const req: RoomPutRequest = {
          officeId: officeId,
          employeeId: ownData.employeeId,
          overlapRoomIds: overlapRoomIds
        }
        const reqJSON = JSON.stringify(req)
        let params = new URLSearchParams()
        params.append('data', reqJSON)
        axios.put(`${URL}room`, params)
      }
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

export default MyIcon

/*/////////%で座標を計算する場合。
const xRatio = Math.round(
  left: employeeData.xCoordinate * Math.round(officeSize.officeWidth / 100),
  top: employeeData.yCoordinate * Math.round(officeSize.officeHeight / 100)
/*
((initialCoordinate.left + data.lastX) / officeSize.officeWidth) * 100)
const yRatio = Math.round(
  ((initialCoordinate.top + data.lastY) / officeSize.officeHeight) * 100
)
*/

/*/////////Roomとアイコンの座標比較用。
console.log(
      `ownStartX:${ownStartX},ownStartY:${ownStartY},ownEndX:${ownEndX},ownEndY:${ownEndY}`
    )
console.log(
  `roomStartX:${roomStartX},roomStartY:${roomStartY},roomEndX:${roomEndX},roomEndY:${roomEndY}`
)
*/

/*/////////検知エリアとemployeeとその中間の座標比較用。
console.log('ーーーーーーーーーー重なったーーーーーーーー')
console.log(`自分X：${sensorStartX}　自分Y：${sensorStartY}`)
console.log(`相手X：${employeeStartX}　相手Y：${employeeStartY}`)
console.log(`中間X：${halfwayPointX}　中間Y：${halfwayPointY}`)
*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////

import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useSelector } from 'react-redux'
import { storage } from '../../../../firebase'
import { DraggableData, DraggableEvent } from 'react-draggable'
import { getEmployees } from '../../../stores/slices/employeesStatusSlice'
import { getRooms } from '../../../stores/slices/roomsStatusSlice'
import axios from 'axios'
import { getFurniture } from '../../../stores/slices/furnitureStatusSlice'
import {
  fsUpdateCoordinate,
  judgeJoinFurniture,
  judgeEmployeeOverlapFurniture,
  judgeEmployeeOverlapRoom,
  judgeOverlapFurniture,
  judgeOverlapRoom,
  judgeOverLapEmployee
} from '../modules'
import { ROOMURI, FURNITUREURI } from '../utils/cloudUri'
import userIcon from '../../../../public/image/initial-user-icon.png'
import { EmployeeData } from '../../../types/employee'

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
  type: 'enterExit'
  officeId: string
  employeeId: string
  furnitureId: string | string[]
}

const useMyIcon = (
  officeId: string,
  setIsDrag: Dispatch<SetStateAction<boolean>>,
  ownData: Omit<EmployeeData, 'editPermission'>
) => {
  const selector = useSelector((state) => state)
  const employees = getEmployees(selector)
  const rooms = getRooms(selector)
  const furnitureList = getFurniture(selector)
  const [message, setMessage] = useState<false | string>(false)
  const [iconURL, setIconURL] = useState(userIcon)
  const initialCoordinate = {
    left: ownData.xCoordinate,
    top: ownData.yCoordinate
  }
  const pictureRef = ownData.employeePicture
  const imgStyle = {
    backgroundImage: `url(${iconURL})`,
    backgroundSize: 'cover',
    position: 'absolute' as 'absolute'
  }
  useEffect(() => {
    if (pictureRef !== '') {
      const imgRef = storage.ref().child(pictureRef)
      imgRef.getDownloadURL().then((url) => {
        setIconURL(url)
      })
    }
  }, [pictureRef])

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    setIsDrag(false)
    const xCoordinate = initialCoordinate.left + data.lastX //自身のX座標
    const yCoordinate = initialCoordinate.top + data.lastY //自身のY座標

    fsUpdateCoordinate(officeId, ownData.employeeId, xCoordinate, yCoordinate) //座標の更新
    const overlapFurnitureInfo = judgeOverlapFurniture(
      xCoordinate,
      yCoordinate,
      ownData.employeeId,
      furnitureList
    ) //自身と重なっているfurnitureのIDを取得
    if (overlapFurnitureInfo) {
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
      axios.put(ROOMURI, roomParams)
      //furnitureの入室権限があるか判定
      if (!overlapFurnitureInfo.isAuthority) {
        setMessage('入室権限がありません。')
        setTimeout(() => setMessage(false), 2000)
        return
      }
      //furnitureのjoinEmployeesに自身のIDを追加
      const furnitureReq: FurnitureRequest = {
        type: 'enterExit',
        officeId: officeId,
        employeeId: ownData.employeeId,
        furnitureId: overlapFurnitureInfo.furnitureId
      }
      const furnitureReqJSON = JSON.stringify(furnitureReq)
      let furnitureParams = new URLSearchParams()
      furnitureParams.append('data', furnitureReqJSON)
      console.log('通過しているfurniture', furnitureReqJSON)
      axios.put(FURNITUREURI, furnitureParams)
    } else {
      //furnitureと重なっていない
      const joinFurnitureList = judgeJoinFurniture(
        ownData.employeeId,
        furnitureList
      )
      if (joinFurnitureList.length > 0) {
        const furnitureReq: FurnitureRequest = {
          type: 'enterExit',
          officeId: officeId,
          employeeId: ownData.employeeId,
          furnitureId: joinFurnitureList
        }
        const furnitureReqJSON = JSON.stringify(furnitureReq)
        let furnitureParams = new URLSearchParams()
        furnitureParams.append('data', furnitureReqJSON)
        axios.put(FURNITUREURI, furnitureParams)
      }
      //room処理開始
      const overlapRoomIds = judgeOverlapRoom(xCoordinate, yCoordinate, rooms) //自身と重なってるroomのidを一括取得
      if (overlapRoomIds.length === 0) {
        //どのroomとも重なっていない
        const overlapEmployees = judgeOverLapEmployee(
          xCoordinate,
          yCoordinate,
          ownData.employeeId,
          employees
        ) //自身と重なっているemployeeを一括取得
        if (overlapEmployees) {
          //重なっているemployeeがいる

          for (let overlapEmployee of overlapEmployees) {
            //ここで重なってるEmployeeがFurnitureかroomに所属していないか確認。していたらcontinue
            if (
              judgeEmployeeOverlapRoom(overlapEmployee.employeeId, rooms) ||
              judgeEmployeeOverlapFurniture(
                overlapEmployee.employeeId,
                furnitureList
              )
            ) {
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
            axios.post(ROOMURI, params)
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
          axios.put(ROOMURI, params).then((res) => {
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
        axios.put(ROOMURI, params)
      }
    }
  }

  const styleInfo = {
    message: message,
    initialCoordinate: initialCoordinate,
    imgStyle: imgStyle
  }

  return [handleStop, styleInfo] as const
}

export default useMyIcon

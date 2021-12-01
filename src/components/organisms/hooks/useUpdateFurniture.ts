import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFurniture } from '../../../stores/slices/furnitureStatusSlice'
import { DraggableData, DraggableEvent } from 'react-draggable'
import axios from 'axios'
import {
  setUpdatePosition,
  getNewFurniture,
  clearNewFurniture,
  getNewFurnitureColor
} from '../../../stores/slices/newFurnitureSlice'
import { getOfficeId } from '../../../stores/slices/officeStatusSlice'
import { VIRTUALSIZE } from '../utils/iconSize'
import { FURNITUREURI } from '../utils/cloudUri'
import { turnUpdateFurniture } from '../../../stores/slices/dialogsStatusSlice'
import { judgeOverlapFurniture, judgeOverhang } from '../utils'

type PutRequest = {
  type: 'updateFurniture'
  officeId: string
  furnitureId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  isClose: boolean
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
}

const useUpdateFurniture = (
  exe: boolean,
  setExe: Dispatch<SetStateAction<boolean>>
) => {
  const selector = useSelector((state) => state)
  const updateFurniture = getNewFurniture(selector)
  const furnitureColor = getNewFurnitureColor(selector)
  if (!updateFurniture.updateInfo) return
  useEffect(() => {
    if (exe) {
      handleStop()
      setExe(false)
    }
  }, [exe])
  const updateFurnitureSize = updateFurniture.furnitureSize

  const updateFurniturePosition = updateFurniture.updateInfo.position
  const updateFurnitureId = updateFurniture.updateInfo.furnitureId
  const dispatch = useDispatch()

  const furnitureList = getFurniture(selector)
  const [message, setMessage] = useState('')

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    dispatch(
      setUpdatePosition({
        x: updateFurniturePosition.x + data.deltaX,
        y: updateFurniturePosition.y + data.deltaY
      })
    )
  }

  const updateFurnitureStyle = {
    border: '3px red solid',
    width: updateFurnitureSize * VIRTUALSIZE,
    height: updateFurnitureSize * VIRTUALSIZE
  }

  const handleStop = () => {
    const xCoordinate = updateFurniturePosition.x //自身のX座標
    const yCoordinate = updateFurniturePosition.y //自身のY座標
    const isCreate = judgeOverlapFurniture(
      xCoordinate,
      yCoordinate,
      updateFurnitureSize,
      furnitureList,
      updateFurnitureId
    )
    const isOverhang = judgeOverhang(
      xCoordinate,
      yCoordinate,
      updateFurnitureSize
    )

    if (isCreate && isOverhang) {
      setMessage('')
      const newFurniture = getNewFurniture(selector)
      const officeId = getOfficeId(selector)
      const req: PutRequest = {
        type: 'updateFurniture',
        officeId: officeId,
        furnitureId: updateFurnitureId,
        furnitureName: newFurniture.furnitureName,
        furnitureDetail: newFurniture.furnitureDetail,
        furnitureSize: newFurniture.furnitureSize,
        isClose: newFurniture.isClose,
        furnitureColor: newFurniture.furnitureColor,
        authorities: newFurniture.authorities,
        xCoordinate: xCoordinate * 4,
        yCoordinate: yCoordinate * 4
      }
      const reqJSON = JSON.stringify(req)
      let params = new URLSearchParams()
      params.append('data', reqJSON)
      axios
        .put(FURNITUREURI, params)
        .then((res) => {
          dispatch(clearNewFurniture())
          dispatch(turnUpdateFurniture({ isOpen: false }))
        })
        .catch(() => {
          setMessage('作成に失敗しました')
        })
    } else {
      setMessage('ここにはオブジェクトを生成できません。')
    }
  }

  const styleInfo = {
    message: message,
    furnitureColor: furnitureColor,
    updateFurnitureStyle: updateFurnitureStyle,
    updateFurniturePosition: updateFurniturePosition
  }

  return [styleInfo, handleStop, handleDrag] as const
}

export default useUpdateFurniture

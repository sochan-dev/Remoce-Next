import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFurniture } from '../../../stores/slices/furnitureStatusSlice'
import { DraggableData, DraggableEvent } from 'react-draggable'
import axios from 'axios'
import {
  getNewFurnitureSize,
  getNewFurniture,
  clearNewFurniture,
  getNewFurnitureColor
} from '../../../stores/slices/newFurnitureSlice'
import { getOfficeId } from '../../../stores/slices/officeStatusSlice'
import { VIRTUALSIZE } from '../utils/iconSize'
import { FURNITUREURI } from '../utils/cloudUri'
import { judgeOverlapFurniture, judgeOverhang } from '../utils'
import { turnCreateFurniture } from '../../../stores/slices/dialogsStatusSlice'

type PostRequest = {
  officeId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  isClose: boolean
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
}

const useNewFurniture = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const furnitureColor = getNewFurnitureColor(selector)
  const [message, setMessage] = useState('')
  const furnitureList = getFurniture(selector)
  const newFurnitureSize = getNewFurnitureSize(selector)
  const newFurnitureStyle = {
    border: '3px red solid',
    width: newFurnitureSize * VIRTUALSIZE,
    height: newFurnitureSize * VIRTUALSIZE
  }

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    console.log(data.lastX, data.lastY)
    const xCoordinate = data.lastX //自身のX座標
    const yCoordinate = data.lastY //自身のY座標
    const isCreate = judgeOverlapFurniture(
      xCoordinate,
      yCoordinate,
      newFurnitureSize,
      furnitureList
    )
    const isOverhang = judgeOverhang(xCoordinate, yCoordinate, newFurnitureSize)

    if (isCreate && isOverhang) {
      setMessage('')
      const newFurniture = getNewFurniture(selector)
      const officeId = getOfficeId(selector)
      const req: PostRequest = {
        officeId: officeId,
        furnitureName: newFurniture.furnitureName,
        furnitureDetail: newFurniture.furnitureDetail,
        furnitureSize: newFurniture.furnitureSize,
        furnitureColor: newFurniture.furnitureColor,
        isClose: newFurniture.isClose,
        authorities: newFurniture.authorities,
        xCoordinate: xCoordinate * 4,
        yCoordinate: yCoordinate * 4
      }
      const reqJSON = JSON.stringify(req)
      let params = new URLSearchParams()
      params.append('data', reqJSON)
      axios
        .post(FURNITUREURI, params)
        .then((res) => {
          dispatch(clearNewFurniture())
          dispatch(turnCreateFurniture({ isOpen: false }))
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
    newFurnitureStyle: newFurnitureStyle
  }

  return [styleInfo, handleStop] as const
}

export default useNewFurniture

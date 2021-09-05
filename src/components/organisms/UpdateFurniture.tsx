import React, {
  VFC,
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../../firebase'
import { getFurniture } from '../../stores/slices/furnitureStatusSlice'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import axios from 'axios'
import {
  setUpdatePosition,
  getNewFurniture,
  clearNewFurniture,
  getNewFurnitureColor
} from '../../stores/slices/newFurnitureSlice'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'
import {
  judgeLargerTarget,
  judgeSmallerTarget,
  judgeSameTarget
} from './utils/judgeOverlap'
import { OBJECTSIZE } from './utils/iconSize'
import Styles from '../../../styles/sass/furniture.module.scss'
import { turnUpdateFurniture } from '../../stores/slices/dialogsStatusSlice'
import classNames from 'classnames'
import NewFurniture from './NewFurniture'

type props = {
  exe: boolean
  setExe: Dispatch<SetStateAction<boolean>>
}

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

const virtualSize = OBJECTSIZE / 4
const URL =
  'http://localhost:5000/remoce-7a22f/asia-northeast1/remoce/furniture'

const UpdateFurniture: VFC<props> = (props) => {
  const { exe, setExe } = props
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
  /*const [position, setPosition] = useState<{ x: number; y: number }>({
    x: updateFurniture.updateInfo.xCoordinate,
    y: updateFurniture.updateInfo.yCoordinate
  })*/
  const updateFurniturePosition = updateFurniture.updateInfo.position
  const updateFurnitureId = updateFurniture.updateInfo.furnitureId
  const dispatch = useDispatch()
  const draggableRef = useRef(null)
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
    width: updateFurnitureSize * virtualSize,
    height: updateFurnitureSize * virtualSize
  }

  const judgeOverlapFurniture = (xCoordinate: number, yCoordinate: number) => {
    let isOverlap = false
    const ownStartX = xCoordinate
    const ownStartY = yCoordinate
    const ownEndX = ownStartX + updateFurnitureSize * virtualSize
    const ownEndY = ownStartY + updateFurnitureSize * virtualSize
    const ownInfo = {
      ownStartX: ownStartX,
      ownStartY: ownStartY,
      ownEndX: ownEndX,
      ownEndY: ownEndY
    }

    for (let furniture of furnitureList) {
      if (updateFurnitureId === furniture.furnitureId) continue
      const targetInfo = {
        xCoordinate: furniture.xCoordinate / 4,
        yCoordinate: furniture.yCoordinate / 4,
        size: furniture.furnitureSize * virtualSize
      }
      if (isOverlap) break

      if (furniture.furnitureSize < updateFurnitureSize) {
        isOverlap = judgeLargerTarget(ownInfo, targetInfo)
      } else if (furniture.furnitureSize === updateFurnitureSize) {
        isOverlap = judgeSameTarget(ownInfo, targetInfo)
      } else {
        isOverlap = judgeSmallerTarget(ownInfo, targetInfo)
      }
    }

    return !isOverlap
  }

  const judgeOverhang = (xCoordinate: number, yCoordinate: number) => {
    const ownEndX = xCoordinate + updateFurnitureSize * virtualSize
    const ownEndY = yCoordinate + updateFurnitureSize * virtualSize
    return ownEndX <= 600 && ownEndY <= 300 ? true : false
  }

  const handleStop = () => {
    const xCoordinate = updateFurniturePosition.x //自身のX座標
    const yCoordinate = updateFurniturePosition.y //自身のY座標
    const isCreate = judgeOverlapFurniture(xCoordinate, yCoordinate)
    const isOverhang = judgeOverhang(xCoordinate, yCoordinate)

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
        .put(URL, params)
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

  return (
    <Draggable
      nodeRef={draggableRef}
      position={updateFurniturePosition}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds="parent"
      grid={[5, 5]}
    >
      <div
        ref={draggableRef}
        className={classNames(Styles.update, Styles[furnitureColor])}
        style={updateFurnitureStyle}
      >
        {message}
      </div>
    </Draggable>
  )
}

export default UpdateFurniture

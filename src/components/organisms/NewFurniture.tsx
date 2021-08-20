import React, { VFC, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../../../firebase'
import { getFurniture } from '../../stores/slices/furnitureStatusSlice'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import axios from 'axios'
import {
  getNewFurnitureSize,
  getNewFurniture,
  clearNewFurniture,
  clearIsCreate
} from '../../stores/slices/newFurnitureSlice'
import { getScrollValue } from '../../stores/slices/officeStatusSlice'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'
import {
  judgeLargerTarget,
  judgeSmallerTarget,
  judgeSameTarget
} from './utils/judgeOverlap'
import { OBJECTSIZE } from './utils/iconSize'
import Styles from '../../../styles/sass/furniture.module.scss'

type PostRequest = {
  officeId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  isClose: boolean
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
}

const NewFurniture: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const URL =
    'http://localhost:5001/remoce-7a22f/asia-northeast1/remoce/furniture'
  const furnitureList = getFurniture(selector)
  const newFurnitureSize = getNewFurnitureSize(selector)
  const draggableRef = useRef(null)
  const initialCoordinate = {
    left: 10,
    bottom: 60,
    width: newFurnitureSize * OBJECTSIZE,
    height: newFurnitureSize * OBJECTSIZE
  }
  const [message, setMessage] = useState('')

  const judgeOverlapFurniture = (xCoordinate: number, yCoordinate: number) => {
    let isOverlap = false
    const ownStartX = xCoordinate
    const ownStartY = yCoordinate
    const ownEndX = ownStartX + newFurnitureSize * OBJECTSIZE
    const ownEndY = ownStartY + newFurnitureSize * OBJECTSIZE
    const ownInfo = {
      ownStartX: ownStartX,
      ownStartY: ownStartY,
      ownEndX: ownEndX,
      ownEndY: ownEndY
    }

    for (let furniture of furnitureList) {
      const targetInfo = {
        xCoordinate: furniture.xCoordinate,
        yCoordinate: furniture.yCoordinate,
        size: furniture.furnitureSize * OBJECTSIZE
      }
      if (isOverlap) break

      if (furniture.furnitureSize < newFurnitureSize) {
        isOverlap = judgeLargerTarget(ownInfo, targetInfo)
      } else if (furniture.furnitureSize === newFurnitureSize) {
        isOverlap = judgeSameTarget(ownInfo, targetInfo)
      } else {
        isOverlap = judgeSmallerTarget(ownInfo, targetInfo)
      }
    }

    return !isOverlap
  }

  const judgeOverhang = (xCoordinate: number, yCoordinate: number) => {
    const ownEndX = xCoordinate + newFurnitureSize * OBJECTSIZE
    const ownEndY = yCoordinate + newFurnitureSize * OBJECTSIZE

    return ownEndX <= 2000 && ownEndY <= 1500 ? true : false
  }

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    const { scrollX, scrollY } = getScrollValue(selector)
    const xCoordinate = initialCoordinate.left + data.lastX + scrollX //自身のX座標
    const yCoordinate = data.node.offsetTop + data.lastY + scrollY //自身のY座標
    const isCreate = judgeOverlapFurniture(xCoordinate, yCoordinate)
    const isOverhang = judgeOverhang(xCoordinate, yCoordinate)

    if (isCreate && isOverhang) {
      const newFurniture = getNewFurniture(selector)
      const officeId = getOfficeId(selector)
      const req: PostRequest = {
        officeId: officeId,
        furnitureName: newFurniture.furnitureName,
        furnitureDetail: newFurniture.furnitureDetail,
        furnitureSize: newFurniture.furnitureSize,
        isClose: newFurniture.isClose,
        authorities: newFurniture.authorities,
        xCoordinate: xCoordinate,
        yCoordinate: yCoordinate
      }
      const reqJSON = JSON.stringify(req)
      console.log('reqJson', reqJSON)
      let params = new URLSearchParams()
      params.append('data', reqJSON)
      axios
        .post(URL, params)
        .then((res) => {
          dispatch(clearNewFurniture())
        })
        .catch(() => {
          setMessage('作成に失敗しました')
        })
    } else {
      setMessage('ここにはオブジェクトを生成できません。')
    }
  }

  const handleStart = () => {
    dispatch(clearIsCreate())
  }

  return (
    <Draggable
      nodeRef={draggableRef}
      onStop={handleStop}
      onStart={handleStart}
      bounds="parent"
      grid={[15, 15]}
    >
      <div ref={draggableRef} className={Styles.new} style={initialCoordinate}>
        {message}
      </div>
    </Draggable>
  )
}

export default NewFurniture

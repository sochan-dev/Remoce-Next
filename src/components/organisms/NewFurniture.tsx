import React, { VFC, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../../firebase'
import { getFurniture } from '../../stores/slices/furnitureStatusSlice'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import axios from 'axios'
import {
  getNewFurnitureSize,
  getNewFurniture
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
  const selector = useSelector((state) => state)
  const [isDrag, setIsDrag] = useState(false)
  const URL =
    'http://localhost:5001/remoce-7a22f/asia-northeast1/remoce/furniture'
  const furnitureList = getFurniture(selector)
  const newFurnitureSize = getNewFurnitureSize(selector)
  const draggableRef = useRef(null)
  const initialCoordinate = {
    left: 100,
    bottom: 100,
    width: newFurnitureSize * OBJECTSIZE,
    height: newFurnitureSize * OBJECTSIZE
  }

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

    return isOverlap
  }

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    const { scrollX, scrollY } = getScrollValue(selector)
    const xCoordinate = initialCoordinate.left + data.lastX + scrollX //自身のX座標
    const yCoordinate = data.node.offsetTop + data.lastY + scrollY //自身のY座標

    const isCreate = judgeOverlapFurniture(xCoordinate, yCoordinate)
    if (isCreate) {
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
      let params = new URLSearchParams()
      params.append('data', reqJSON)
      axios.post(URL, params)
    }
  }

  const onBlur = () => {
    setIsDrag(false)
    console.log('blur')
  }
  const onClick = () => {
    setIsDrag(true)
    console.log('onClick')
  }

  return (
    <Draggable
      nodeRef={draggableRef}
      onStop={handleStop}
      bounds="parent"
      onStart={onClick}
      grid={[15, 15]}
    >
      <div
        ref={draggableRef}
        className={isDrag ? Styles.new : Styles.new}
        style={initialCoordinate}
      ></div>
    </Draggable>
  )
}

export default NewFurniture

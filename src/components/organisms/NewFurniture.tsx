import React, { VFC, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFurniture } from '../../stores/slices/furnitureStatusSlice'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import axios from 'axios'
import {
  getNewFurnitureSize,
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
import { turnCreateFurniture } from '../../stores/slices/dialogsStatusSlice'
import classNames from 'classnames'

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

const virtualSize = OBJECTSIZE / 4

const NewFurniture: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const furnitureColor = getNewFurnitureColor(selector)
  const [message, setMessage] = useState('')
  const draggableRef = useRef(null)
  const URL =
    'http://localhost:5000/remoce-7a22f/asia-northeast1/remoce/furniture'
  const furnitureList = getFurniture(selector)
  const newFurnitureSize = getNewFurnitureSize(selector)
  const newFurnitureStyle = {
    width: newFurnitureSize * virtualSize,
    height: newFurnitureSize * virtualSize
  }

  const judgeOverlapFurniture = (xCoordinate: number, yCoordinate: number) => {
    let isOverlap = false
    const ownStartX = xCoordinate
    const ownStartY = yCoordinate
    const ownEndX = ownStartX + newFurnitureSize * virtualSize
    const ownEndY = ownStartY + newFurnitureSize * virtualSize
    const ownInfo = {
      ownStartX: ownStartX,
      ownStartY: ownStartY,
      ownEndX: ownEndX,
      ownEndY: ownEndY
    }

    for (let furniture of furnitureList) {
      const targetInfo = {
        xCoordinate: furniture.xCoordinate / 4,
        yCoordinate: furniture.yCoordinate / 4,
        size: furniture.furnitureSize * virtualSize
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
    const ownEndX = xCoordinate + newFurnitureSize * virtualSize
    const ownEndY = yCoordinate + newFurnitureSize * virtualSize

    return ownEndX <= 600 && ownEndY <= 300 ? true : false
  }

  const handleStop = (_: DraggableEvent, data: DraggableData) => {
    console.log(data.lastX, data.lastY)
    const xCoordinate = data.lastX //自身のX座標
    const yCoordinate = data.lastY //自身のY座標
    const isCreate = judgeOverlapFurniture(xCoordinate, yCoordinate)
    const isOverhang = judgeOverhang(xCoordinate, yCoordinate)

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
        .post(URL, params)
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
  return (
    <Draggable
      nodeRef={draggableRef}
      onStop={handleStop}
      bounds="parent"
      grid={[5, 5]}
    >
      <div
        ref={draggableRef}
        className={classNames(Styles.new, Styles[furnitureColor])}
        style={newFurnitureStyle}
      >
        {message}
      </div>
    </Draggable>
  )
}

export default NewFurniture

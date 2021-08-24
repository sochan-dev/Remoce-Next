import React, { VFC } from 'react'
import { useDispatch } from 'react-redux'
import { OBJECTSIZE } from '../organisms/utils/iconSize'
import {
  setUpdateFurniture,
  setNewFurnitureName
} from '../../stores/slices/newFurnitureSlice'
import Styles from '../../../styles/sass/furniture.module.scss'
import { turnUpdateFurniture } from '../../stores/slices/dialogsStatusSlice'
type props = {
  virtual?: true
  furnitureData: {
    roomId: string
    furnitureId: string
    furnitureName: string
    furnitureDetail: string
    furnitureSize: number
    isClose: boolean
    authorities: string[]
    xCoordinate: number
    yCoordinate: number
  }
}

const Furniture: VFC<props> = (props) => {
  const dispatch = useDispatch()
  const furnitureData = props.furnitureData
  const furnitureSizeStyle = furnitureData.furnitureSize * OBJECTSIZE
  const magnification = props.virtual ? 4 : 1
  const furnitureStyle = {
    width: `${furnitureSizeStyle / magnification}px`,
    height: `${furnitureSizeStyle / magnification}px`,
    left: `${furnitureData.xCoordinate / magnification}px`,
    top: `${furnitureData.yCoordinate / magnification}px`
  }

  const onDoubleClick = () => {
    const updateFurniture = {
      furnitureName: furnitureData.furnitureName,
      furnitureDetail: furnitureData.furnitureDetail,
      furnitureSize: furnitureData.furnitureSize,
      isClose: furnitureData.isClose,
      authorities: furnitureData.authorities,
      updateInfo: {
        furnitureId: furnitureData.furnitureId,
        position: {
          x: furnitureData.xCoordinate / 4,
          y: furnitureData.yCoordinate / 4
        }
      }
    }
    dispatch(setUpdateFurniture(updateFurniture))
    dispatch(turnUpdateFurniture({ isOpen: true }))
  }

  return (
    <>
      <div
        className={Styles.exist}
        style={furnitureStyle}
        onDoubleClick={() => onDoubleClick()}
      ></div>
    </>
  )
}

export default Furniture

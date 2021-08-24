import React, { VFC } from 'react'
import { OBJECTSIZE } from '../organisms/utils/iconSize'
import Styles from '../../../styles/sass/furniture.module.scss'
type props = {
  furnitureData: {
    roomId: string
    furnitureName: string
    furnitureDetail: string
    furnitureSize: number
    isClose: boolean
    authorities: string[]
    xCoordinate: number
    yCoordinate: number
  }
}

const VirtualFurniture: VFC<props> = (props) => {
  const {
    roomId,
    furnitureName,
    furnitureDetail,
    furnitureSize,
    isClose,
    authorities,
    xCoordinate,
    yCoordinate
  } = props.furnitureData
  const furnitureSizeStyle = furnitureSize * OBJECTSIZE
  const furnitureStyle = {
    width: furnitureSizeStyle,
    height: furnitureSizeStyle,
    left: xCoordinate,
    top: yCoordinate
  }

  return <div className={Styles.exist} style={furnitureStyle}></div>
}

export default VirtualFurniture

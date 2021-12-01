import React, { VFC } from 'react'
import { OBJECTSIZE } from '../organisms/utils/iconSize'
import Styles from '../../../styles/sass/furniture.module.scss'
import { FurnitureData } from '../../types/furniture'
type Props = {
  furnitureData: Omit<
    FurnitureData,
    'furnitureId' | 'joinEmployees' | 'furnitureColor'
  >
}

const VirtualFurniture: VFC<Props> = (props) => {
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

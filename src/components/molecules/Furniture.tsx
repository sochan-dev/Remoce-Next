import React, { useState, VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OBJECTSIZE } from '../organisms/utils/iconSize'
import { setUpdateFurniture } from '../../stores/slices/newFurnitureSlice'
import { getEditPermission } from '../../stores/slices/employeesStatusSlice'
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
  const { virtual } = props
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [isHover, setIsHover] = useState(false)
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
    const editPermission = getEditPermission(selector)

    if (virtual || !editPermission) return
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
  const isCloseMsg = furnitureData.isClose ? 'はい' : 'いいえ'

  return (
    <div
      className={Styles.exist}
      style={furnitureStyle}
      onDoubleClick={() => onDoubleClick()}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      {isHover && (
        <div className={Styles.hover}>
          <p>名前：{furnitureData.furnitureName}</p>
          <p>詳細：{furnitureData.furnitureDetail}</p>
          <p>閉鎖：{isCloseMsg}</p>
        </div>
      )}
    </div>
  )
}

export default Furniture

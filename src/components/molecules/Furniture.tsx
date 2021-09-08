import React, { VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OBJECTSIZE } from '../organisms/utils/iconSize'
import { setUpdateFurniture } from '../../stores/slices/newFurnitureSlice'
import { getEditPermission } from '../../stores/slices/employeesStatusSlice'
import Styles from '../../../styles/sass/furniture.module.scss'
import { turnUpdateFurniture } from '../../stores/slices/dialogsStatusSlice'
import classNames from 'classnames'

type props = {
  virtual?: true
  furnitureData: {
    roomId: string
    furnitureId: string
    furnitureName: string
    furnitureDetail: string
    furnitureSize: number
    furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
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
    console.log('doubleClick')
    const editPermission = getEditPermission(selector)

    if (virtual || !editPermission) return
    const updateFurniture = {
      furnitureName: furnitureData.furnitureName,
      furnitureDetail: furnitureData.furnitureDetail,
      furnitureSize: furnitureData.furnitureSize,
      furnitureColor: furnitureData.furnitureColor,
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
  const isCloseMsg = furnitureData.isClose ? '不可' : false

  return (
    <div
      className={classNames(Styles.exist, Styles[furnitureData.furnitureColor])}
      style={furnitureStyle}
      onDoubleClick={() => onDoubleClick()}
    >
      {!virtual && (
        <div className={Styles.name}>{furnitureData.furnitureName}</div>
      )}
      <div
        className={virtual ? Styles.virtualHover : Styles.hover}
        onDoubleClick={() => onDoubleClick()}
      >
        {isCloseMsg && (
          <p className={Styles.isCloseMsg}>ここは通話出来ません。</p>
        )}
        <p>{furnitureData.furnitureDetail}</p>
      </div>
    </div>
  )
}

export default Furniture

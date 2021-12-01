import { useDispatch, useSelector } from 'react-redux'
import { OBJECTSIZE } from '../../organisms/utils/iconSize'
import { setUpdateFurniture } from '../../../stores/slices/newFurnitureSlice'
import { getEditPermission } from '../../../stores/slices/employeesStatusSlice'
import { turnUpdateFurniture } from '../../../stores/slices/dialogsStatusSlice'
import { FurnitureData } from '../../../types/furniture'

const useFurniture = (virtual: boolean, furnitureData: FurnitureData) => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const furnitureSizeStyle = furnitureData.furnitureSize * OBJECTSIZE
  const magnification = virtual ? 4 : 1
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
  return [furnitureStyle, onDoubleClick] as const
}

export default useFurniture

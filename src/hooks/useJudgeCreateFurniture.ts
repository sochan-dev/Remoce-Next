import { useSelector } from 'react-redux'
import {
  getFurnitureName,
  getIsDisplay
} from '../stores/slices/newFurnitureSlice'

const useJudgeCreateFurniture = () => {
  const selector = useSelector((state) => state)
  const furnitureName = getFurnitureName(selector)
  const isDisplay = getIsDisplay(selector)

  let isCreateFurniture = false

  if (furnitureName !== '' || isDisplay) {
    isCreateFurniture = true
  }

  return [isCreateFurniture]
}

export default useJudgeCreateFurniture

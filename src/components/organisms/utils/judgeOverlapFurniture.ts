import { FurnitureData } from './../../../types/furniture'
import { VIRTUALSIZE } from './iconSize'
import { judgeLargerTarget, judgeSameTarget, judgeSmallerTarget } from './index'

export const judgeOverlapFurniture = (
  xCoordinate: number,
  yCoordinate: number,
  saveFurnitureSize: number,
  furnitureList: FurnitureData[],
  updateFurnitureId?: string
) => {
  let isOverlap = false
  const ownStartX = xCoordinate
  const ownStartY = yCoordinate
  const ownEndX = ownStartX + saveFurnitureSize * VIRTUALSIZE
  const ownEndY = ownStartY + saveFurnitureSize * VIRTUALSIZE
  const ownInfo = {
    ownStartX: ownStartX,
    ownStartY: ownStartY,
    ownEndX: ownEndX,
    ownEndY: ownEndY
  }

  for (let furniture of furnitureList) {
    if (updateFurnitureId && updateFurnitureId === furniture.furnitureId) {
      continue
    }
    const targetInfo = {
      xCoordinate: furniture.xCoordinate / 4,
      yCoordinate: furniture.yCoordinate / 4,
      size: furniture.furnitureSize * VIRTUALSIZE
    }
    if (isOverlap) break

    if (furniture.furnitureSize < saveFurnitureSize) {
      isOverlap = judgeLargerTarget(ownInfo, targetInfo)
    } else if (furniture.furnitureSize === saveFurnitureSize) {
      isOverlap = judgeSameTarget(ownInfo, targetInfo)
    } else {
      isOverlap = judgeSmallerTarget(ownInfo, targetInfo)
    }
  }

  return !isOverlap
}

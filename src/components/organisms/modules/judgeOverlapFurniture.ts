import { FurnitureData } from '../../../types/furniture'
import { ICONSIZE, SENSORSIZE, OBJECTSIZE } from '../utils/iconSize'
import { judgeLargerTarget } from '../utils/index'

type OverlapFurnitureInfo = {
  furnitureId: string
  isAuthority: boolean
}

export const judgeOverlapFurniture = (
  xCoordinate: number,
  yCoordinate: number,
  employeeId: string,
  furnitureList: FurnitureData[]
): OverlapFurnitureInfo | false => {
  let overlapFurnitureInfo: OverlapFurnitureInfo | false = false
  const ownStartX = xCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
  const ownStartY = yCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
  const ownEndX = ownStartX + ICONSIZE
  const ownEndY = ownStartY + ICONSIZE
  const ownInfo = {
    ownStartX: ownStartX,
    ownStartY: ownStartY,
    ownEndX: ownEndX,
    ownEndY: ownEndY
  }

  for (let furniture of furnitureList) {
    if (overlapFurnitureInfo) break
    const targetInfo = {
      xCoordinate: furniture.xCoordinate,
      yCoordinate: furniture.yCoordinate,
      size: furniture.furnitureSize * OBJECTSIZE
    }
    if (judgeLargerTarget(ownInfo, targetInfo)) {
      const authorities = furniture.authorities
      let isAuthority = false

      if (authorities.length === 0) isAuthority = true
      authorities.forEach((authority) => {
        if (authority === employeeId) isAuthority = true
      })

      overlapFurnitureInfo = {
        furnitureId: furniture.furnitureId,
        isAuthority: isAuthority
      }
    }
  }
  return overlapFurnitureInfo
}

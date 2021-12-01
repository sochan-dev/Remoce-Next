import { VIRTUALSIZE } from './iconSize'

export const judgeOverhang = (
  xCoordinate: number,
  yCoordinate: number,
  saveFurnitureSize: number
) => {
  const ownEndX = xCoordinate + saveFurnitureSize * VIRTUALSIZE
  const ownEndY = yCoordinate + saveFurnitureSize * VIRTUALSIZE

  return ownEndX <= 600 && ownEndY <= 300 ? true : false
}

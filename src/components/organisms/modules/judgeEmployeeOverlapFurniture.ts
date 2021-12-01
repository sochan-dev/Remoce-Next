import { FurnitureData } from '../../../types/furniture'
export const judgeEmployeeOverlapFurniture = (
  employeeId: string,
  furnitureList: FurnitureData[]
) => {
  let isOverlap = false
  for (let furniture of furnitureList) {
    if (isOverlap) break
    for (let joinEmployeeId of furniture.joinEmployees) {
      if (isOverlap) break
      if (joinEmployeeId === employeeId) isOverlap = true
    }
  }
  return isOverlap
}

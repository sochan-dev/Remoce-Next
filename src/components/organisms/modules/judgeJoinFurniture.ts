import { FurnitureData } from '../../../types/furniture'

export const judgeJoinFurniture = (
  employeeId: string,
  furnitureList: FurnitureData[]
) => {
  let joinFurnitureList: string[] = []
  furnitureList.forEach((furniture) => {
    furniture.joinEmployees.forEach((joinEmployee) => {
      if (employeeId === joinEmployee) {
        joinFurnitureList.push(furniture.furnitureId)
      }
    })
  })
  return joinFurnitureList
}

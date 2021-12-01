import { RoomData } from '../../../types/room'
export const judgeEmployeeOverlapRoom = (
  employeeId: string,
  rooms: RoomData[]
) => {
  let isOverlap = false
  for (let room of rooms) {
    if (isOverlap) break
    for (let joinEmployeeId of room.joinEmployees) {
      if (isOverlap) break
      if (employeeId === joinEmployeeId) isOverlap = true
    }
  }
  return isOverlap
}

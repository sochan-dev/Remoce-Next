import { RoomData } from '../../../types/room'
import { SENSORSIZE, ICONSIZE, ROOMSIZE } from '../utils/iconSize'
export const judgeOverlapRoom = (
  xCoordinate: number,
  yCoordinate: number,
  rooms: RoomData[]
): string[] => {
  let overlapRoomIds: string[] = []
  const ownStartX = xCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
  const ownStartY = yCoordinate + (SENSORSIZE / 2 - ICONSIZE / 2)
  const ownCenterX = ownStartX + ICONSIZE / 2
  const ownCenterY = ownStartY + ICONSIZE / 2

  rooms.forEach((room) => {
    const roomStartX = room.xCoordinate
    const roomStartY = room.yCoordinate
    const roomCenterX = roomStartX + ROOMSIZE / 2
    const roomCenterY = roomStartY + ROOMSIZE / 2

    const crotchNum = ownCenterX - roomCenterX
    const hookNum = ownCenterY - roomCenterY
    const bowstringNum = crotchNum * crotchNum + hookNum * hookNum
    const radiusSum = ICONSIZE / 2 + ROOMSIZE / 2

    if (bowstringNum <= radiusSum * radiusSum) {
      overlapRoomIds.push(room.roomId)
    }
  })
  return overlapRoomIds
}

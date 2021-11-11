import React, { VFC } from 'react'
import { useSelector } from 'react-redux'
import { getRooms } from '../../stores/slices/roomsStatusSlice'
import { Room } from '../molecules'

const ShowRoomsArea: VFC = () => {
  const selector = useSelector((state) => state)
  const rooms = getRooms(selector)

  return (
    <>
      {rooms.map((room, i) => (
        <Room
          key={i}
          roomId={room.roomId}
          xCoordinate={room.xCoordinate}
          yCoordinate={room.yCoordinate}
        />
      ))}
    </>
  )
}

export default ShowRoomsArea

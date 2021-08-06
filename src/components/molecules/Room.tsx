import React, { VFC } from 'react'
import Styles from '../../../styles/sass/room.module.scss'

type props = {
  roomId: string
  roomX: number
  roomY: number
}

const Room: VFC<props> = (props) => {
  const { roomId, roomX, roomY } = props
  const initialCoordinate = {
    left: roomX,
    top: roomY
  }
  return (
    <div className={Styles.root} style={initialCoordinate}>
      <div className={Styles.centerMark}></div>
    </div>
  )
}

export default Room

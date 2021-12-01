import React, { VFC } from 'react'
import Styles from '../../../styles/sass/room.module.scss'

type Props = {
  roomId: string
  xCoordinate: number
  yCoordinate: number
}

const Room: VFC<Props> = (props) => {
  const { roomId, xCoordinate, yCoordinate } = props
  const initialCoordinate = {
    left: xCoordinate,
    top: yCoordinate
  }
  return (
    <div className={Styles.root} style={initialCoordinate}>
      <div className={Styles.centerMark}></div>
    </div>
  )
}

export default Room

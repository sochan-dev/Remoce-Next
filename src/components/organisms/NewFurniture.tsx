import React, { VFC, useRef } from 'react'
import Draggable from 'react-draggable'
import Styles from '../../../styles/sass/furniture.module.scss'
import classNames from 'classnames'
import { useNewFurniture } from './hooks'

const NewFurniture: VFC = () => {
  const draggableRef = useRef(null)
  const [styleInfo, handleStop] = useNewFurniture()
  return (
    <Draggable
      nodeRef={draggableRef}
      onStop={handleStop}
      bounds="parent"
      grid={[5, 5]}
    >
      <div
        ref={draggableRef}
        className={classNames(Styles.new, Styles[styleInfo.furnitureColor])}
        style={styleInfo.newFurnitureStyle}
      >
        {styleInfo.message}
      </div>
    </Draggable>
  )
}

export default NewFurniture

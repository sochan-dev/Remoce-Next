import React, { VFC, useRef, Dispatch, SetStateAction } from 'react'
import Draggable from 'react-draggable'
import Styles from '../../../styles/sass/furniture.module.scss'
import classNames from 'classnames'
import { useUpdateFurniture } from './hooks'

type Props = {
  exe: boolean
  setExe: Dispatch<SetStateAction<boolean>>
}

const UpdateFurniture: VFC<Props> = (props) => {
  const { exe, setExe } = props
  const draggableRef = useRef(null)
  const [styleInfo, handleStop, handleDrag] = useUpdateFurniture(exe, setExe)

  return (
    <Draggable
      nodeRef={draggableRef}
      position={styleInfo.updateFurniturePosition}
      onDrag={handleDrag}
      onStop={handleStop}
      bounds="parent"
      grid={[5, 5]}
    >
      <div
        ref={draggableRef}
        className={classNames(Styles.update, Styles[styleInfo.furnitureColor])}
        style={styleInfo.updateFurnitureStyle}
      >
        {styleInfo.message}
      </div>
    </Draggable>
  )
}

export default UpdateFurniture

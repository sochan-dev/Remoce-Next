import React, { VFC, useRef, Dispatch, SetStateAction } from 'react'
import Draggable from 'react-draggable'
import Styles from '../../../styles/sass/employeeIcon.module.scss'
import classNames from 'classnames'
import { EmployeeData } from '../../types/employee'
import { useMyIcon } from './hooks'

type Props = {
  id: number
  officeId: string
  isDrag: boolean
  setIsDrag: Dispatch<SetStateAction<boolean>>
  ownData: Omit<EmployeeData, 'editPermission'>
}

const dragAreaStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  zIndex: 16,
  position: 'absolute' as 'absolute'
}

const MyIcon: VFC<Props> = (props) => {
  const { officeId, ownData, isDrag, setIsDrag } = props
  const draggableRef = useRef(null)

  const [handleStop, handleDrag, styleInfo] = useMyIcon(
    officeId,
    setIsDrag,
    ownData
  )

  return (
    <Draggable
      nodeRef={draggableRef}
      onStop={handleStop}
      onDrag={handleDrag}
      position={styleInfo.position}
      onStart={() => setIsDrag(true)}
      bounds="parent"
      handle=".dragArea"
    >
      <div
        ref={draggableRef}
        className={classNames(Styles.mine, isDrag && Styles.mineSensor)}
      >
        <div
          className={classNames('dragArea', Styles.icon, Styles.cursor)}
          style={styleInfo.imgStyle}
        >
          <div className="dragArea" style={dragAreaStyle}></div>
        </div>

        {styleInfo.message && (
          <div className={Styles.hover}>
            <p className={Styles.message}>{styleInfo.message}</p>
          </div>
        )}
      </div>
    </Draggable>
  )
}

export default MyIcon

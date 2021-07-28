import React, { VFC, useRef } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../../firebase'
import { getOfficeSize } from '../../stores/slices/officeStatusSlice'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Styles from '../../../styles/sass/employeeIcon.module.scss'

type props = {
  id: number
  officeId: string
  employeeData: {
    employeeId: string
    employeeName: string
    xCoordinate: number
    yCoordinate: number
  }
  officeSize: {
    officeWidth: number
    officeHeight: number
  }
}

const MyIcon: VFC<props> = (props) => {
  console.log('MyIcon再レンダリング')
  const selector = useSelector((state) => state)
  const { officeId, employeeData, officeSize } = props
  const draggableRef = useRef(null)
  const initialCoordinate = {
    left: employeeData.xCoordinate * Math.round(officeSize.officeWidth / 100),
    top: employeeData.yCoordinate * Math.round(officeSize.officeHeight / 100)
  }

  const handleOnStop = (_: DraggableEvent, data: DraggableData) => {
    const xRatio = Math.round(
      ((initialCoordinate.left + data.lastX) / officeSize.officeWidth) * 100
    )
    const yRatio = Math.round(
      ((initialCoordinate.top + data.lastY) / officeSize.officeHeight) * 100
    )

    db.collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(employeeData.employeeId)
      .update({
        employee_x_coordinate: xRatio,
        employee_y_coordinate: yRatio
      })
      .then(() => {
        console.log('完了')
      })
      .catch((e) => console.log('MyIcon座標更新失敗'))
  }

  return (
    <Draggable nodeRef={draggableRef} onStop={handleOnStop} bounds="parent">
      <div ref={draggableRef} className={Styles.mine} style={initialCoordinate}>
        <AccountCircleIcon className={Styles.icon} />
      </div>
    </Draggable>
  )
}

export default MyIcon
/**
 *
 * <Draggable
      position={{
        x: currentPosition.xCoordinate,
        y: currentPosition.yCoordinate
      }}
      onDrag={handleOnDrag}
    >
      <div className={Styles.mine}></div>
    </Draggable>
 */

/*const [initialCoordinate, setInitialCoordinate] = useState({
    top: 0,
    left: 0
  })
  const [parentWidth, setParentWidth] = useState(0)
  const [parentHeight, setParentHeight] = useState(0)*/

/*useEffect(() => {
    setParentWidth(draggableRef.current.parentNode.clientWidth)
    setParentHeight(draggableRef.current.parentNode.clientHeight)
  }, [])
  useEffect(() => {
    setInitialCoordinate({
      left: employeeData.xCoordinate * Math.round(officeSize.officeWidth / 100),
      top: employeeData.yCoordinate * Math.round(officeSize.officeHeight / 100)
    })
  }, [parentWidth, parentHeight])*/

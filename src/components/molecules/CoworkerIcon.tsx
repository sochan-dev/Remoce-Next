import React, { VFC, useState, Dispatch, SetStateAction } from 'react'
import Styles from '../../../styles/sass/employeeIcon.module.scss'
import classNames from 'classnames'
import { EmployeeData } from '../../types/employee'
import { useCoworkerIcon } from './hooks'

type Props = {
  id: number
  officeId: string
  isDrag: boolean
  setIsDrag: Dispatch<SetStateAction<boolean>>
  ownData: Omit<EmployeeData, 'editPermission'>
}

const CoworkerIcon: VFC<Props> = (props) => {
  const { id, officeId, ownData, isDrag } = props
  const [isHover, setIsHover] = useState(false)
  const imgStyle = useCoworkerIcon(id, officeId, ownData)
  const initialCoordinate = {
    left: ownData.xCoordinate,
    top: ownData.yCoordinate
  }

  return (
    <div
      className={classNames(Styles.coworker, isDrag && Styles.coworkerSensor)}
      style={initialCoordinate}
    >
      <div
        onMouseOver={() => setIsHover(true)}
        className={Styles.icon}
        style={imgStyle}
      ></div>
      {isHover && (
        <div className={Styles.hover} onMouseOut={() => setIsHover(false)}>
          <p>{ownData.employeeName}</p>
        </div>
      )}
    </div>
  )
}

export default CoworkerIcon

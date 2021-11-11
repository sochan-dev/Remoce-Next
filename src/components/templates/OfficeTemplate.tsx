import React, { VFC, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  CallScreen,
  OfficeFooter,
  ShowEmployeesArea,
  ShowRoomsArea,
  ShowFurnitureArea
} from '../organisms'
import Styles from '../../../styles/sass/office.module.scss'

const OfficeTemplate: VFC = () => {
  const rootRef = useRef(null)

  return (
    <div className={Styles.root} ref={rootRef}>
      <div className={Styles.showEmployeesArea}>
        <ShowEmployeesArea />
        <ShowRoomsArea />
        <ShowFurnitureArea />
      </div>
      <OfficeFooter />
      <CallScreen />
    </div>
  )
}

export default OfficeTemplate

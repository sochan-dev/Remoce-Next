import React, { VFC, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  CallScreen,
  OfficeFooter,
  ShowEmployeesArea,
  ShowRoomsArea,
  ShowFurnitureArea,
  TestInvite,
  CreateFurnitureForm
} from '../organisms'
import Styles from '../../../styles/sass/office.module.scss'

const OfficeTemplate: VFC = () => {
  const selector = useSelector((state) => state)
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
      <div className={Styles.inviteTest}>
        <TestInvite />
      </div>
    </div>
  )
}

export default OfficeTemplate

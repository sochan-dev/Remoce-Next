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
import { getIsCreate } from '../../stores/slices/newFurnitureSlice'
import Styles from '../../../styles/sass/office.module.scss'

const OfficeTemplate: VFC = () => {
  const selector = useSelector((state) => state)
  const isCreate = getIsCreate(selector)
  const rootRef = useRef(null)
  if (rootRef.current) console.log('rootRef', rootRef.current.scrollTop)
  return (
    <div className={Styles.root} ref={rootRef}>
      <div className={Styles.showEmployeesArea}>
        <ShowEmployeesArea />
        <ShowRoomsArea />
        <ShowFurnitureArea />
      </div>
      {isCreate && <CreateFurnitureForm />}
      <OfficeFooter />
      <CallScreen />
      <div className={Styles.inviteTest}>
        <TestInvite />
      </div>
    </div>
  )
}

export default OfficeTemplate

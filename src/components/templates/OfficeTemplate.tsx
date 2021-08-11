import React, { VFC, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  CallScreen,
  OfficeFooter,
  ShowEmployeesArea,
  TestInvite,
  CreateFurnitureForm
} from '../organisms'
import { getIsCreate } from '../../stores/slices/newFurnitureSlice'
import Styles from '../../../styles/sass/office.module.scss'

const OfficeTemplate: VFC = () => {
  const selector = useSelector((state) => state)
  const isCreate = getIsCreate(selector)
  return (
    <div className={Styles.root}>
      <CallScreen />
      <div className={Styles.inviteTest}>
        <TestInvite />
      </div>
      <div className={Styles.showEmployeesArea}>
        <ShowEmployeesArea />
      </div>
      {isCreate && <CreateFurnitureForm />}
      <OfficeFooter />
    </div>
  )
}

export default OfficeTemplate

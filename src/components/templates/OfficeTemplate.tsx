import React, { VFC, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { ShowEmployeesArea, TestInvite } from '../organisms'
import { fetchOfficeSize } from '../../stores/slices/officeStatusSlice'
import Styles from '../../../styles/sass/office.module.scss'

const OfficeTemplate: VFC = () => {
  const dispatch = useDispatch()
  const officeRef = useRef(null)

  useEffect(() => {
    dispatch(
      fetchOfficeSize({
        officeWidth: officeRef.current.offsetWidth,
        officeHeight: officeRef.current.offsetHeight
      })
    )
  }, [])

  useEffect(() => {
    window.addEventListener('resize', () => {
      dispatch(
        fetchOfficeSize({
          officeWidth: officeRef.current.offsetWidth,
          officeHeight: officeRef.current.offsetHeight
        })
      )
    })
  }, [])

  return (
    <div className={Styles.root}>
      <div className={Styles.inviteTest}>
        <TestInvite />
      </div>
      <div className={Styles.showEmployeesArea} ref={officeRef}>
        <ShowEmployeesArea />
      </div>
    </div>
  )
}

export default OfficeTemplate

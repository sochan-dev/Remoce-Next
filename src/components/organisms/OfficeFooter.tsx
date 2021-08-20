import React, { VFC } from 'react'
import { useDispatch } from 'react-redux'
import { ActionButton } from '../atoms'
import { setCreateDisplay } from '../../stores/slices/newFurnitureSlice'
import Styles from '../../../styles/sass/officeFooter.module.scss'

const rootStyle = {
  position: 'fixed',
  display: 'flex',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '50px',
  border: 'solid 1px black',
  backgroundColor: 'red',
  zIndex: 1
}

const OfficeFooter = () => {
  const dispatch = useDispatch()
  const handleOnClick = () => {
    dispatch(setCreateDisplay())
  }
  return (
    <div className={Styles.root}>
      <ActionButton label={'新規作成'} w={10} onClick={handleOnClick} />
    </div>
  )
}

export default OfficeFooter

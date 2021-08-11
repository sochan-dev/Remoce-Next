import React, { VFC } from 'react'
import { useDispatch } from 'react-redux'
import { ActionButton } from '../atoms'
import { setIsCreate } from '../../stores/slices/newFurnitureSlice'
import Styles from '../../../styles/sass/footer.module.scss'

const OfficeFooter = () => {
  const dispatch = useDispatch()
  const handleOnClick = () => {
    dispatch(setIsCreate())
  }
  return (
    <div className={Styles.root}>
      <ActionButton label={'新規作成'} w={10} onClick={handleOnClick} />
    </div>
  )
}

export default OfficeFooter

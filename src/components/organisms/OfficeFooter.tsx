import React, { VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionButton } from '../atoms'
import {
  UpdateEmployeeForm,
  VersatilityDialog,
  CreateFurnitureForm
} from '../organisms'
import {
  getAllDialogStatus,
  turnCreateFurniture,
  turnUpdateFurniture,
  turnUpdateEmployee
} from '../../stores/slices/dialogsStatusSlice'
import Styles from '../../../styles/sass/officeFooter.module.scss'
import UpdateFurnitureForm from './UpdateFurnitureForm'

const OfficeFooter: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const dialogsStatus = getAllDialogStatus(selector)

  const handleUpdateEmployeeDialog = () => {
    dispatch(turnUpdateEmployee())
  }
  const handleCreateFurnitureDialog = () => {
    dispatch(turnCreateFurniture())
  }

  return (
    <>
      <div className={Styles.root}>
        <ActionButton
          label={'オブジェクトを作成'}
          w={10}
          onClick={handleCreateFurnitureDialog}
        />
        <ActionButton
          label={'社員情報'}
          w={10}
          onClick={handleUpdateEmployeeDialog}
        />
      </div>

      {/*--------ダイアログ-------- */}
      <VersatilityDialog
        isOpen={dialogsStatus.updateEmployee}
        setIsOpen={turnUpdateEmployee}
        maxWidth={'md'}
      >
        <UpdateEmployeeForm />
      </VersatilityDialog>

      <VersatilityDialog
        isOpen={dialogsStatus.createFurniture}
        setIsOpen={turnCreateFurniture}
        maxWidth={'md'}
      >
        <CreateFurnitureForm />
      </VersatilityDialog>

      <VersatilityDialog
        isOpen={dialogsStatus.updateFurniture}
        setIsOpen={turnUpdateFurniture}
        maxWidth={'md'}
      >
        <UpdateFurnitureForm />
      </VersatilityDialog>
    </>
  )
}

export default OfficeFooter

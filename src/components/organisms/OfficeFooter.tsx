import React, { useState, VFC } from 'react'
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
import { getEditPermission } from '../../stores/slices/employeesStatusSlice'
import Styles from '../../../styles/sass/officeFooter.module.scss'
import UpdateFurnitureForm from './UpdateFurnitureForm'

const OfficeFooter: VFC = () => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState<string | false>(false)
  const selector = useSelector((state) => state)
  const dialogsStatus = getAllDialogStatus(selector)

  const handleUpdateEmployeeDialog = () => {
    dispatch(turnUpdateEmployee())
  }
  const handleCreateFurnitureDialog = () => {
    const editPermission = getEditPermission(selector)
    if (!editPermission) {
      setMessage('編集権限がありません。')
      setTimeout(() => setMessage(false), 2000)
      return
    }
    dispatch(turnCreateFurniture())
  }

  return (
    <>
      <div className={Styles.root}>
        <div>
          {message && <p className={Styles.message}>{message}</p>}
          <ActionButton
            label={'オブジェクトを作成'}
            w={10}
            onClick={handleCreateFurnitureDialog}
          />
        </div>

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

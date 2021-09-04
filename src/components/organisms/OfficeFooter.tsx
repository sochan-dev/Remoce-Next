import React, { useState, VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { ActionButton } from '../atoms'
import {
  UpdateEmployeeForm,
  VersatilityDialog,
  CreateFurnitureForm,
  OfficeMenu
} from '../organisms'
import {
  getAllDialogStatus,
  turnCreateFurniture,
  turnUpdateFurniture,
  turnUpdateEmployee,
  turnOfficeMenu
} from '../../stores/slices/dialogsStatusSlice'
import {
  getEditPermission,
  getEmployeeId
} from '../../stores/slices/employeesStatusSlice'
import Styles from '../../../styles/sass/officeFooter.module.scss'
import UpdateFurnitureForm from './UpdateFurnitureForm'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'
import { customAxios } from '../../components/organisms/utils/customAxios'

type PutRequest = {
  isExit: boolean
  officeId: string
  employeeId: string
}

const URL = 'https://asia-northeast1-remoce-7a22f.cloudfunctions.net/remoce/'
const OfficeFooter: VFC = () => {
  const router = useRouter()
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

  const handleOfficeMenuDialog = () => {
    dispatch(turnOfficeMenu())
  }

  const handleLeave = async () => {
    const officeId = getOfficeId(selector)
    const employeeId = getEmployeeId(selector)
    const employeeReq: PutRequest = {
      isExit: true,
      officeId: officeId,
      employeeId: employeeId
    }
    const employeeReqJSON = JSON.stringify(employeeReq)
    let employeeParams = new URLSearchParams()
    employeeParams.append('data', employeeReqJSON)
    customAxios.defaults.withCredentials = true
    await customAxios
      .put(`${URL}employee`, employeeParams, {
        withCredentials: true
      })
      /*await fetch(`${URL}employee`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: employeeReqJSON,
      mode: 'cors'
    })*/ .then(() => {
        router.push(`/`)
      })
  }

  return (
    <>
      <div className={Styles.root}>
        <div>
          {message && <p className={Styles.message}>{message}</p>}
          <ActionButton
            label={'オブジェクトを作成'}
            w={20}
            onClick={handleCreateFurnitureDialog}
          />
        </div>

        <ActionButton
          label={'社員情報'}
          w={10}
          onClick={handleUpdateEmployeeDialog}
        />
        <ActionButton
          w={10}
          label={'メニュー'}
          onClick={handleOfficeMenuDialog}
        />
        <ActionButton w={10} label={'退社'} onClick={handleLeave} />
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

      <VersatilityDialog
        isOpen={dialogsStatus.officeMenu}
        setIsOpen={turnOfficeMenu}
        maxWidth={'md'}
      >
        <OfficeMenu />
      </VersatilityDialog>
    </>
  )
}

export default OfficeFooter

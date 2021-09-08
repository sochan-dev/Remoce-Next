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
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined'
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined'
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

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
        <div className={Styles.icon}>
          <Tooltip title={message ? message : 'オブジェクトを作成'}>
            <IconButton onClick={handleCreateFurnitureDialog}>
              <BuildOutlinedIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
        <div className={Styles.icon}>
          <Tooltip title={message ? message : '社員情報'}>
            <IconButton onClick={handleUpdateEmployeeDialog}>
              <PersonOutlinedIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
        <div className={Styles.icon}>
          <Tooltip title={message ? message : '招待'}>
            <IconButton onClick={handleOfficeMenuDialog}>
              <GroupAddOutlinedIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
        <div className={Styles.icon}>
          <Tooltip title={message ? message : '退社'}>
            <IconButton onClick={handleLeave}>
              <ExitToAppIcon color={'primary'} />
            </IconButton>
          </Tooltip>
        </div>
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
        maxWidth={'xl'}
      >
        <CreateFurnitureForm />
      </VersatilityDialog>

      <VersatilityDialog
        isOpen={dialogsStatus.updateFurniture}
        setIsOpen={turnUpdateFurniture}
        maxWidth={'xl'}
      >
        <UpdateFurnitureForm />
      </VersatilityDialog>

      <VersatilityDialog
        isOpen={dialogsStatus.officeMenu}
        setIsOpen={turnOfficeMenu}
        maxWidth={'xl'}
      >
        <OfficeMenu />
      </VersatilityDialog>
    </>
  )
}

export default OfficeFooter

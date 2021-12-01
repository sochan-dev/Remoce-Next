import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  getAllDialogStatus,
  turnCreateFurniture,
  turnUpdateEmployee,
  turnOfficeMenu
} from '../../../stores/slices/dialogsStatusSlice'
import {
  getEditPermission,
  getEmployeeId
} from '../../../stores/slices/employeesStatusSlice'
import { getOfficeId } from '../../../stores/slices/officeStatusSlice'
import { customAxios } from '../../../components/organisms/utils/customAxios'
import { EMPLOYEEURI } from './../utils/cloudUri'

type PutRequest = {
  isExit: boolean
  officeId: string
  employeeId: string
}

const useOfficeFooter = () => {
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
      .put(EMPLOYEEURI, employeeParams, {
        withCredentials: true
      })
      .then(() => {
        router.push(`/`)
      })
  }

  const handles = {
    handleUpdateEmployeeDialog: handleUpdateEmployeeDialog,
    handleCreateFurnitureDialog: handleCreateFurnitureDialog,
    handleOfficeMenuDialog: handleOfficeMenuDialog,
    handleLeave: handleLeave
  }

  return [handles, dialogsStatus, message] as const
}

export default useOfficeFooter

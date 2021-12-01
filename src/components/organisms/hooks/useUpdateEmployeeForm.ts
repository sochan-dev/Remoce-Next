import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { turnUpdateEmployee } from '../../../stores/slices/dialogsStatusSlice'
import { useUpdateEmployeeData } from '../hooks'
import axios from 'axios'
import { getOfficeId } from '../../../stores/slices/officeStatusSlice'
import { getEmployeeId } from '../../../stores/slices/employeesStatusSlice'
import { useRouter } from 'next/router'
import { EMPLOYEEURI } from './../utils/cloudUri'

type Request = {
  officeId: string
  employeeId: string
}

const useUpdateEmployeeForm = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [ownData, updateEmployee, setStates] = useUpdateEmployeeData()
  const profileImgRef = useRef<HTMLInputElement>(null)

  const afterFunction = () => dispatch(turnUpdateEmployee({ isOpen: false }))
  const handleUpdateEmployee = async () => await updateEmployee(afterFunction)
  const handleClick = () => profileImgRef.current.click()

  const deleteEmployee = async () => {
    const officeId = getOfficeId(selector)
    const employeeId = getEmployeeId(selector)
    const employeeReq: Request = {
      officeId: officeId,
      employeeId: employeeId
    }
    const employeeReqJSON = JSON.stringify(employeeReq)
    let employeeParams = new URLSearchParams()
    employeeParams.append('data', employeeReqJSON)
    axios
      .request({
        method: 'delete',
        url: EMPLOYEEURI,
        data: employeeParams
      })
      .then(() => {
        router.push('/')
      })
  }
}

export default useUpdateEmployeeForm

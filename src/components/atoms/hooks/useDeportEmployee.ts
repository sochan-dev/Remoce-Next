import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getOfficeId } from '../../../stores/slices/officeStatusSlice'
import { turnDeportEmployee } from '../../../stores/slices/dialogsStatusSlice'

type Request = {
  officeId: string
  employeeId: string
}
const useDeportEmployee = (employeeId: string, employeeName: string) => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)

  const deport = async () => {
    const officeId = getOfficeId(selector)
    const employeeReq: Request = {
      officeId: officeId,
      employeeId: employeeId
    }
    const employeeReqJSON = JSON.stringify(employeeReq)
    let employeeParams = new URLSearchParams()
    employeeParams.append('data', employeeReqJSON)
    await axios
      .request({
        method: 'delete',
        url: `${URL}employee`,
        data: employeeParams
      })
      .then((res) => {
        console.log('完了', res)
        dispatch(turnDeportEmployee({ isOpen: false }))
      })
  }

  return deport
}

export default useDeportEmployee

import React, { VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'
import { turnDeportEmployee } from '../../stores/slices/dialogsStatusSlice'
import { EmployeeData } from '../../types/employee'

type props = Pick<EmployeeData, 'employeeId' | 'employeeName'>

type Request = {
  officeId: string
  employeeId: string
}

const URL = 'http://localhost:5001/remoce-7a22f/asia-northeast1/remoce/'

const DeportEmployee: VFC<props> = (props) => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const { employeeId, employeeName } = props

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

  return <p onClick={() => deport()}>{employeeName}</p>
}

export default DeportEmployee

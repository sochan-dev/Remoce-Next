import React, { useRef, VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { turnUpdateEmployee } from '../../stores/slices/dialogsStatusSlice'
import { InputText, ActionButton } from '../atoms'
import { useUpdateEmployeeData } from '../../hooks'
import axios from 'axios'
import Styles from '../../../styles/sass/updateEmployeeForm.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'
import { getEmployeeId } from '../../stores/slices/employeesStatusSlice'
import { useRouter } from 'next/router'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import WorkOffOutlinedIcon from '@material-ui/icons/WorkOffOutlined'

type Request = {
  officeId: string
  employeeId: string
}

const URL = 'http://localhost:5000/remoce-7a22f/asia-northeast1/remoce/'

const UpdateEmployeeForm: VFC = () => {
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
        url: `${URL}employee`,
        data: employeeParams
      })
      .then(() => {
        router.push('/')
      })
  }

  return (
    <>
      <div className={Styles.root}>
        <h1>あなたの社員情報</h1>

        <img
          src={ownData.profileImg}
          alt="no images"
          className={Styles.previewArea}
          onClick={() => handleClick()}
        />
        <div className={Blanks.blank_8} />
        <InputText
          label={'名前'}
          type={'text'}
          value={ownData.employeeName}
          onChange={setStates.inputEmployeeName}
        />
        <div className={Blanks.blank_16} />
        <ActionButton label={'更新する'} onClick={handleUpdateEmployee} />
        <div className={Blanks.blank_32} />
        <div className={Styles.retire}>
          <Tooltip title={'退職する'}>
            <IconButton onClick={deleteEmployee}>
              <WorkOffOutlinedIcon color={'secondary'} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {/*//////////////////////////////////////////////*/}
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={setStates.inputProfileImg}
        ref={profileImgRef}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default UpdateEmployeeForm

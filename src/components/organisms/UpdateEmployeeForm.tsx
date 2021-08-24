import React, { useRef, VFC, Dispatch, SetStateAction } from 'react'
import { useDispatch } from 'react-redux'
import { turnUpdateEmployee } from '../../stores/slices/dialogsStatusSlice'
import { InputText, ActionButton } from '../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { useUpdateEmployeeData } from '../../hooks'
import Styles from '../../../styles/sass/updateEmployeeForm.module.scss'

const UpdateEmployeeForm: VFC = () => {
  const dispatch = useDispatch()
  const [ownData, updateEmployee, setStates] = useUpdateEmployeeData()
  const profileImgRef = useRef<HTMLInputElement>(null)

  const afterFunction = () => dispatch(turnUpdateEmployee({ isOpen: false }))
  const handleUpdateEmployee = async () => await updateEmployee(afterFunction)
  const handleClick = () => profileImgRef.current.click()

  return (
    <>
      <div className={Styles.root}>
        <h1>あなたの社員情報</h1>
        <p>{ownData.employeeId}</p>
        <img
          src={ownData.profileImg}
          alt="no images"
          className={Styles.previewArea}
          onClick={() => handleClick()}
        />
        <InputText
          label={'名前'}
          type={'text'}
          value={ownData.employeeName}
          onChange={setStates.inputEmployeeName}
        />
        <div className={Blanks.blank_32} />
        <ActionButton label={'更新する'} onClick={handleUpdateEmployee} />
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

import Router, { useRouter } from 'next/router'
import React, { VFC, useState, ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { getAuthStatus } from '../../stores/slices/authStatusSlice'
import { InputText, ActionButton } from '../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { db } from '../../../firebase'

const CreateOfficeHome: VFC = () => {
  const router = useRouter()
  const selector = useSelector((state) => state)
  const { userId } = getAuthStatus(selector)
  const [officeName, setOfficeName] = useState('')
  const [employeeName, setEmployeeName] = useState('')

  const inputOfficeName = (e: ChangeEvent<HTMLInputElement>) => {
    setOfficeName(e.target.value)
  }

  const inputEmployeeName = (e: ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(e.target.value)
  }

  const createOffice = async () => {
    if (officeName == '' || employeeName == '') return

    let officeId: string, employeeId: string
    await db
      .collection('offices')
      .add({
        office_name: officeName
      })
      .then(async (doc) => {
        officeId = doc.id
        await db
          .collection('offices')
          .doc(officeId)
          .collection('employees')
          .add({
            is_office: false,
            employee_name: employeeName,
            employee_picture: '',
            employee_x_coordinate: 20,
            employee_y_coordinate: 20
          })
          .then(async (doc) => {
            employeeId = doc.id
            await db
              .collection('users')
              .doc(userId)
              .collection('employee_to_office')
              .doc(employeeId)
              .set({
                office_id: officeId,
                employee_id: employeeId,
                employee_name: employeeName
              })
          })
      })
    router.push(`/office/${officeId}/${employeeId}`)
  }

  return (
    <>
      <h1>オフィスの作成</h1>
      <InputText
        label={'リモートオフィスの名前'}
        type={'text'}
        value={officeName}
        onChange={inputOfficeName}
      />
      <div className={Blanks.blank_16} />
      <InputText
        label={'あなたの名前'}
        type={'text'}
        value={employeeName}
        onChange={inputEmployeeName}
      />
      <div className={Blanks.blank_16} />
      <ActionButton label={'登録'} onClick={createOffice} />
    </>
  )
}

export default CreateOfficeHome

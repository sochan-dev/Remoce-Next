import Router from 'next/router'
import React, { VFC, useState, ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { getAuthStatus } from '../../stores/slices/authStatusSlice'
import { InputText, ActionButton } from '../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { db } from '../../../firebase'

const CreateOfficeHome: VFC = () => {
  const { userId, isLoading } = useSelector(getAuthStatus)
  const [officeName, setOfficeName] = useState('')
  const [employeeName, setEmployeeName] = useState('')

  const inputOfficeName = (e: ChangeEvent<HTMLInputElement>) => {
    setOfficeName(e.target.value)
  }

  const inputEmployeeName = (e: ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(e.target.value)
  }

  const createOffice = async () => {
    let officeId: string, employeeId: string
    await db
      .collection('offices')
      .add({
        office_name: officeName
      })
      .then((doc) => {
        const officeId = doc.id
        db.collection('offices')
          .doc(officeId)
          .collection('employees')
          .add({
            employee_name: employeeName
          })
          .then((doc) => {
            const employeeId = doc.id
            db.collection('users')
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

    Router.push(`office/${officeId}/${employeeId}`)
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

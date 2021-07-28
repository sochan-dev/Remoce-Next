import React, { VFC, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { InputText, ActionButton } from '../atoms'
import { db, fieldValue } from '../../../firebase'
import { deleteInvite } from '../../stores/slices/notificationsSlice'
import Styles from '../../../styles/sass/card.module.scss'

type props = {
  userId: string
  officeId: string
  officeName: string
  officePicture?: string
}

const InviteCard: VFC<props> = (props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { userId, officeId, officeName } = props
  const [employeeName, setEmployeeName] = useState('')

  const inputEmployeeName = (e: ChangeEvent<HTMLInputElement>) => {
    setEmployeeName(e.target.value)
  }

  const handleOnClick = async () => {
    if (employeeName == '') return

    let employeeId: string

    await db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .add({
        is_office: false,
        employee_name: employeeName,
        employee_x_coordinate: 20,
        employee_y_coordinate: 20
      })
      .then(async (doc) => {
        console.log('carddoc->', doc, 'carddoc.id->', doc.id)
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
      .then(async () => {
        await db
          .collection('users')
          .doc(userId)
          .update({
            invited_office: fieldValue.arrayRemove(officeId)
          })
      })
      .catch((e) => {
        console.log('参加エラー')
      })
    dispatch(deleteInvite(officeId))
    router.push(`/office/${officeId}/${employeeId}`)
  }

  return (
    <div className={Styles.invite}>
      <p>{`office_id:${officeId},office_name:${officeName}`}</p>
      <InputText
        type={'text'}
        label={'あなたの社員名'}
        value={employeeName}
        onChange={inputEmployeeName}
      />
      <ActionButton onClick={handleOnClick} label={'参加'} />
    </div>
  )
}
export default InviteCard

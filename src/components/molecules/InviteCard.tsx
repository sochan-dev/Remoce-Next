import React, { VFC, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { InputText, ActionButton } from '../atoms'
import { db, fieldValue, realTimeDB } from '../../../firebase'
import { deleteInvite } from '../../stores/slices/notificationsSlice'
import Styles from '../../../styles/sass/card.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { NotificationData } from '../../types/notification'

type props = {
  userId: string
  invite: NotificationData['invites'][0]
}

const InviteCard: VFC<props> = (props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const userId = props.userId
  const { officeId, officeName } = props.invite
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
        uid: userId,
        is_office: false,
        employee_name: employeeName,
        employee_picture: '',
        edit_permission: false,
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
      .then(async () => {
        await db
          .collection('users')
          .doc(userId)
          .update({
            invited_office: fieldValue.arrayRemove(officeId)
          })
      })
      .then(async () => {
        await realTimeDB.ref(`status/${employeeId}`).set({
          officeId: officeId,
          status: false
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
      <p className={Styles.officeName}>{officeName}</p>
      <div className={Blanks.blank_32} />
      <InputText
        type={'text'}
        label={'あなたの社員名'}
        value={employeeName}
        onChange={inputEmployeeName}
      />
      <div className={Blanks.blank_16} />
      <ActionButton onClick={handleOnClick} label={'参加'} />
    </div>
  )
}
export default InviteCard

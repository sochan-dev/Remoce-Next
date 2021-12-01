import { useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { db, fieldValue, realTimeDB } from '../../../../firebase'
import { deleteInvite } from '../../../stores/slices/notificationsSlice'

const useInviteCard = (userId: string, officeId: string) => {
  const router = useRouter()
  const dispatch = useDispatch()
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

  const controlEmployeeName = {
    employeeName: employeeName,
    inputEmployeeName: inputEmployeeName
  }

  return [handleOnClick, controlEmployeeName] as const
}

export default useInviteCard

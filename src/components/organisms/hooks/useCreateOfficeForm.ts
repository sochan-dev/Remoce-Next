import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { getAuthStatus } from '../../../stores/slices/authStatusSlice'
import { db, realTimeDB } from '../../../../firebase'

const useCreateOfficeForm = () => {
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
            uid: userId,
            is_office: false,
            employee_name: employeeName,
            employee_picture: '',
            employee_x_coordinate: 20,
            employee_y_coordinate: 20,
            edit_permission: true
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
              .collection('offices')
              .doc(officeId)
              .collection('room')
              .doc('room')
              .set({
                rooms: []
              })
          })
          .then(async () => {
            await realTimeDB.ref(`status/${employeeId}`).set({
              status: false,
              officeId: officeId
            })
          })
      })
    router.push(`/office/${officeId}/${employeeId}`)
  }
  const formValues = {
    officeName: officeName,
    employeeName: employeeName
  }
  const formControls = {
    inputOfficeName: inputOfficeName,
    inputEmployeeName: inputEmployeeName,
    createOffice: createOffice
  }
  return [formValues, formControls] as const
}

export default useCreateOfficeForm

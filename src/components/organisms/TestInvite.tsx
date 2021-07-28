import React, { VFC, useState, ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { InputText, ActionButton } from '../atoms'
import { db, fieldValue } from '../../../firebase'
import { getOffice } from '../../stores/slices/officeStatusSlice'
import { getEmployeeId } from '../../stores/slices/employeesStatusSlice'

const TestInvite: VFC = () => {
  const router = useRouter()
  const selector = useSelector((state) => state)
  const [userId, setUserId] = useState('')
  const { officeId } = getOffice(selector)
  const employeeId = getEmployeeId(selector)

  const inputUserId = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value)
  }

  const inviteUser = async () => {
    await db
      .collection('users')
      .doc(userId)
      .update({
        invited_office: fieldValue.arrayUnion(officeId)
      })
    setUserId('')
  }

  const handleLeave = async () => {
    await db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(employeeId)
      .update({
        is_office: false
      })
    router.push(`/`)
  }

  return (
    <>
      <InputText
        label={'招待するuserId'}
        w={70}
        value={userId}
        onChange={inputUserId}
      />
      <ActionButton w={20} label={'招待'} onClick={inviteUser} />
      <ActionButton w={10} label={'退社'} onClick={handleLeave} />
    </>
  )
}

export default TestInvite

import React, { VFC, useState, ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { InputText, ActionButton } from '../atoms'
import { db, fieldValue } from '../../../firebase'
import { getOffice } from '../../stores/slices/officeStatusSlice'
import VersatilityDialog from './VersatilityDialog'
import {
  getIsDeportEmployee,
  turnDeportEmployee
} from '../../stores/slices/dialogsStatusSlice'
import ShowEmployeesArea from './ShowEmployeesArea'
import ShowDeportTargetsArea from '../molecules/ShowDeportTargets'

type Employee_to_office = {
  employee_id: string
  employee_name: string
  office_id: string
}

const OfficeMenu: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [userId, setUserId] = useState('')
  const { officeId } = getOffice(selector)
  const isOpen = getIsDeportEmployee(selector)

  const inputUserId = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value)
  }

  const handleDeportEmployeeDialog = () => {
    dispatch(turnDeportEmployee())
  }

  const inviteUser = async () => {
    console.log('userId', userId)
    let isInvite = true
    const employee_to_officeCollectionRef = db
      .collection('users')
      .doc(userId)
      .collection('employee_to_office')
    const employee_to_officeRef = db.collection('users').doc(userId)

    await db.runTransaction(async (transaction) => {
      const snapshot = await employee_to_officeRef.get()
      console.log('snaoshots', snapshot.exists)
      if (snapshot.exists) {
        const snapshots = await employee_to_officeCollectionRef.get()
        if (!snapshots.empty) {
          snapshots.forEach((snapshot) => {
            const userInfo = snapshot.data() as Employee_to_office
            if (officeId === userInfo.office_id) {
              console.log('通過１')
              isInvite = false //すでに入社してる
            }
          })
        }
      } else {
        //userIdのユーザーが存在しない
        console.log('通過２')
        isInvite = false
      }
      if (isInvite) {
        transaction.update(employee_to_officeRef, {
          invited_office: fieldValue.arrayUnion(officeId)
        })
      } else {
        console.log('invite　false通過')
      }
      return
    })
    setUserId('')
  }

  return (
    <>
      <div>
        <InputText
          label={'招待するuserId'}
          w={70}
          value={userId}
          onChange={inputUserId}
        />
        <ActionButton w={20} label={'招待'} onClick={inviteUser} />
        <ActionButton
          w={10}
          label={'追放'}
          onClick={handleDeportEmployeeDialog}
        />
      </div>
      <VersatilityDialog
        isOpen={isOpen}
        setIsOpen={turnDeportEmployee}
        maxWidth={'md'}
      >
        <div>
          <ShowDeportTargetsArea />
        </div>
      </VersatilityDialog>
    </>
  )
}

export default OfficeMenu

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
    await db
      .collection('users')
      .doc(userId)
      .update({
        invited_office: fieldValue.arrayUnion(officeId)
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

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
import ShowDeportTargetsArea from '../molecules/ShowDeportTargets'
import Styles from '../../../styles/sass/officeMenu.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import PersonAddDisabledOutlinedIcon from '@material-ui/icons/PersonAddDisabledOutlined'
import { WorkPlace_data } from '../../types/workPlace'

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
      if (snapshot.exists) {
        const snapshots = await employee_to_officeCollectionRef.get()
        if (!snapshots.empty) {
          snapshots.forEach((snapshot) => {
            const userInfo = snapshot.data() as WorkPlace_data
            if (officeId === userInfo.office_id) isInvite = false //すでに入社してる
          })
        }
      } else isInvite = false //userIdのユーザーが存在しない

      if (isInvite) {
        transaction.update(employee_to_officeRef, {
          invited_office: fieldValue.arrayUnion(officeId)
        })
      }
      return
    })
    setUserId('')
  }

  return (
    <>
      <div className={Styles.root}>
        <InputText
          label={'招待するuserId'}
          w={100}
          value={userId}
          onChange={inputUserId}
        />
        <div>
          <ActionButton w={100} label={'招待'} onClick={inviteUser} />
        </div>
      </div>
      <div className={Styles.deport}>
        <Tooltip title={'追放'}>
          <IconButton onClick={handleDeportEmployeeDialog}>
            <PersonAddDisabledOutlinedIcon
              color={'secondary'}
              className={Styles.icon}
            />
          </IconButton>
        </Tooltip>
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

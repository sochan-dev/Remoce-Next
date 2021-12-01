import React, { VFC } from 'react'
import { InputText, ActionButton } from '../atoms'
import Styles from '../../../styles/sass/card.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { NotificationData } from '../../types/notification'
import { useInviteCard } from './hooks'

type Props = {
  userId: string
  invite: NotificationData['invites'][0]
}

const InviteCard: VFC<Props> = (props) => {
  const { userId, invite } = props
  const [handleOnClick, employeeNameControl] = useInviteCard(
    userId,
    invite.officeId
  )
  const { employeeName, inputEmployeeName } = employeeNameControl

  return (
    <div className={Styles.invite}>
      <p className={Styles.officeName}>{invite.officeName}</p>
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

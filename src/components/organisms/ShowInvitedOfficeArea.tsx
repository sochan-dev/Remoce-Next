import React, { VFC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { InviteCard } from '../molecules'
import { getInvites } from '../../stores/slices/notificationsSlice'
import { getAuthStatus } from '../../stores/slices/authStatusSlice'
import Styles from '../../../styles/sass/cardList.module.scss'

const ShowInvitedOfficeArea: VFC = () => {
  const selector = useSelector((state) => state)
  const invites = getInvites(selector)
  const userId = getAuthStatus(selector).userId

  const isExist = invites.length !== 0

  return (
    <div className={Styles.root}>
      {isExist ? (
        <>
          {invites.map((data, i) => (
            <InviteCard
              userId={userId}
              officeId={data.officeId}
              officeName={data.officeName}
              key={i}
            />
          ))}
        </>
      ) : (
        <p>現在オフィスからの招待はありません。</p>
      )}
    </div>
  )
}

export default ShowInvitedOfficeArea

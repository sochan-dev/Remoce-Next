import React, { VFC, MutableRefObject } from 'react'
import { useSelector } from 'react-redux'
import { getScreenStatus } from '../../stores/slices/screenStatus'
import { UserVideo, LocalVideo } from '../molecules'
import Styles from '../../../styles/sass/screenArea.module.scss'
import { LocalInfo, RemoteUser } from '../../types/sfu'

type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type Props = {
  isMinimize: boolean
  localInfo: LocalInfo
  remoteUsers: RemoteUser[]
}

const ScreenArea: VFC<Props> = (props) => {
  const { isMinimize, localInfo, remoteUsers } = props
  const selector = useSelector((state) => state)
  const { attentionPeerId } = getScreenStatus(selector)
  const attentionUser =
    attentionPeerId !== localInfo.id || attentionPeerId !== ''
      ? remoteUsers.filter((user) => user.id === attentionPeerId)[0]
      : false

  const localStyle = isMinimize
    ? {
        visibility: 'hidden' as 'hidden',
        height: '0px',
        lineHeight: '0px',
        overflow: 'hidden',
        margin: '0px'
      }
    : {
        visibility: 'visible' as 'visible'
      }

  return (
    <>
      {localInfo.id === attentionPeerId || attentionPeerId === '' ? (
        <div className={Styles.root}>
          {!isMinimize && (
            <div className={Styles.row}>
              {remoteUsers.map((user, i) => (
                <UserVideo
                  video={user.video}
                  userId={user.id}
                  employeeStatus={user.employeeStatus}
                  size={{ height: '20vh' }}
                  key={i}
                />
              ))}
            </div>
          )}
          <div className={Styles.attentionRow}>
            <div style={localStyle}>
              <LocalVideo
                video={localInfo.video}
                userId={localInfo.id}
                size={{ height: '66vh' }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={Styles.root}>
          <div className={Styles.row}>
            <div style={localStyle}>
              <LocalVideo
                video={localInfo.video}
                userId={localInfo.id}
                size={{ height: '20vh' }}
              />
            </div>
            {!isMinimize &&
              remoteUsers.map((user, i) => {
                user.id !== attentionPeerId && (
                  <UserVideo
                    video={user.video}
                    userId={user.id}
                    employeeStatus={user.employeeStatus}
                    key={i}
                    size={{ height: '20vh' }}
                  />
                )
              })}
          </div>
          {!isMinimize && (
            <div className={Styles.attentionRow}>
              {attentionUser && (
                <UserVideo
                  video={attentionUser.video}
                  userId={attentionUser.id}
                  employeeStatus={attentionUser.employeeStatus}
                  size={{ height: '66vh' }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ScreenArea

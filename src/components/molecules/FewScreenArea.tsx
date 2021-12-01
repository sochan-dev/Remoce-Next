import React, { VFC } from 'react'
import { UserVideo, LocalVideo } from '../molecules'
import Styles from '../../../styles/sass/screenArea.module.scss'
import { LocalInfo, RemoteUser } from '../../types/sfu'

type Props = {
  isMinimize: boolean
  localInfo: LocalInfo
  remoteUsers: RemoteUser[]
}

const FewScreenArea: VFC<Props> = (props) => {
  const { isMinimize, localInfo, remoteUsers } = props
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
  const videoSize = Math.round(100 / (remoteUsers.length + 1))

  return (
    <>
      {!remoteUsers ? (
        <></>
      ) : remoteUsers.length < 3 ? (
        <div className={Styles.root}>
          <div className={Styles.fewRow}>
            <div style={localStyle}>
              <LocalVideo
                video={localInfo.video}
                userId={localInfo.id}
                size={{ width: `${videoSize}vw` }}
              />
            </div>
            {!isMinimize &&
              remoteUsers.map((user, i) => (
                <UserVideo
                  video={user.video}
                  userId={user.id}
                  employeeStatus={user.employeeStatus}
                  size={{ width: `${videoSize}vw` }}
                  key={i}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className={Styles.root}>
          <div className={Styles.fewRow}>
            <div style={localStyle}>
              <LocalVideo
                video={localInfo.video}
                userId={localInfo.id}
                size={{ maxWidth: '50%', maxHeight: '43vh' }}
              />
            </div>
            {!isMinimize &&
              remoteUsers.map((user, i) => {
                i < 3 && (
                  <UserVideo
                    size={{ maxWidth: '50%', maxHeight: '43vh' }}
                    video={user.video}
                    userId={user.id}
                    employeeStatus={user.employeeStatus}
                    key={i}
                  />
                )
              })}
          </div>
          {!isMinimize && (
            <div className={Styles.fewRow}>
              {remoteUsers.map((user, i) => {
                i > 3 && (
                  <UserVideo
                    size={{ maxWidth: '50vw', maxHeight: '43vh' }}
                    video={user.video}
                    userId={user.id}
                    employeeStatus={user.employeeStatus}
                    key={i}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default FewScreenArea

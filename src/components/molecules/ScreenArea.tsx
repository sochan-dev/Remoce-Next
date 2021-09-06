import React, { VFC, MutableRefObject } from 'react'
import { UserVideo } from '../atoms'
import Styles from '../../../styles/sass/screenArea.module.scss'

type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type props = {
  attentionPeerId: string
  isMinimize: boolean
  localInfo: {
    id: string
    video: MutableRefObject<HTMLVideoElement>
  }
  remotesInfo: {
    id: string
    video: MediaStream
    employeeStatus?: EmployeeStatus
  }[]
}

const ScreenArea: VFC<props> = (props) => {
  const { attentionPeerId, isMinimize, localInfo, remotesInfo } = props
  console.log('ScreenArea', attentionPeerId, isMinimize, localInfo, remotesInfo)
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
  const attentionUser =
    attentionPeerId !== localInfo.id || attentionPeerId === ''
      ? remotesInfo.filter((user) => user.id === attentionPeerId)[0]
      : false

  return (
    <>
      {localInfo.id === attentionPeerId || attentionPeerId === '' ? (
        <div className={Styles.root}>
          {!isMinimize && (
            <div className={Styles.row}>
              {remotesInfo.map((user, i) => (
                <UserVideo
                  video={user.video}
                  userId={user.id}
                  employeeStatus={user.employeeStatus}
                  key={i}
                />
              ))}
            </div>
          )}
          <div className={Styles.attentionRow}>
            <div style={localStyle}>
              <video
                style={{ height: '66vh' }}
                ref={localInfo.video}
                autoPlay
                playsInline
                muted
              ></video>
            </div>
          </div>
        </div>
      ) : (
        <div className={Styles.root}>
          <div className={Styles.row}>
            <div style={localStyle}>
              <video
                style={{ height: '20vh' }}
                ref={localInfo.video}
                autoPlay
                playsInline
                muted
              ></video>
            </div>
            {!isMinimize &&
              remotesInfo.map((user, i) => {
                user.id !== attentionPeerId && (
                  <UserVideo
                    video={user.video}
                    userId={user.id}
                    employeeStatus={user.employeeStatus}
                    key={i}
                    attention
                  />
                )
              })}
          </div>
          {!isMinimize && (
            <div className={Styles.row}>
              {attentionUser && (
                <UserVideo
                  video={attentionUser.video}
                  userId={attentionUser.id}
                  employeeStatus={attentionUser.employeeStatus}
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

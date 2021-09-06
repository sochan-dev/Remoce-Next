import React, { MutableRefObject, VFC } from 'react'
import { UserVideo } from '../atoms'
import Styles from '../../../styles/sass/screenArea.module.scss'

type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type props = {
  isMinimize: boolean
  localVideo: MutableRefObject<HTMLVideoElement>
  remotesInfo: {
    id: string
    video: MediaStream
    employeeStatus?: EmployeeStatus
  }[]
}

const FewScreenArea: VFC<props> = (props) => {
  const { isMinimize, localVideo, remotesInfo } = props
  console.log('FewScreenArea内', remotesInfo)
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
      {remotesInfo.length < 3 ? (
        <div className={Styles.root}>
          <div className={Styles.row}>
            <div style={localStyle}>
              <video
                width="320px"
                ref={localVideo}
                autoPlay
                playsInline
                muted
              ></video>
            </div>
            {!isMinimize &&
              remotesInfo.map((user, i) => (
                <UserVideo
                  video={user.video}
                  userId={user.id}
                  employeeStatus={user.employeeStatus}
                  key={i}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className={Styles.root}>
          <div className={Styles.row}>
            <div style={localStyle}>
              <video
                width="320px"
                ref={localVideo}
                autoPlay
                playsInline
                muted
              ></video>
            </div>
            {!isMinimize &&
              remotesInfo.map((user, i) => {
                i < 3 && (
                  <UserVideo
                    video={user.video}
                    userId={user.id}
                    employeeStatus={user.employeeStatus}
                    key={i}
                  />
                )
              })}
          </div>
          {!isMinimize && (
            <div className={Styles.row}>
              {remotesInfo.map((user, i) => {
                i > 3 && (
                  <UserVideo
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

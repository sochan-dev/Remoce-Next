import React, { MutableRefObject, VFC } from 'react'
import { UserVideo, LocalVideo } from '../molecules'
import Styles from '../../../styles/sass/screenArea.module.scss'
import VideocamOutlined from '@material-ui/icons/VideocamOutlined'

type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type props = {
  isMinimize: boolean
  localInfo: {
    id: string
    video: MediaStream
    videoRef: MutableRefObject<HTMLVideoElement>
  }
  remotesInfo: {
    id: string
    video: MediaStream
    employeeStatus?: EmployeeStatus
  }[]
}

const FewScreenArea: VFC<props> = (props) => {
  const { isMinimize, localInfo, remotesInfo } = props
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
  const videoSize = Math.round(100 / (remotesInfo.length + 1))
  console.log('videoSize', videoSize, 'length', remotesInfo.length)
  console.log('remotesInfo', remotesInfo)
  return (
    <>
      {remotesInfo.length < 3 ? (
        <div className={Styles.root}>
          {console.log('通話！！！UC')}
          <div className={Styles.fewRow}>
            <div style={localStyle}>
              <LocalVideo
                video={localInfo.video}
                userId={localInfo.id}
                size={{ width: `${videoSize}vw` }}
              />
            </div>
            {!isMinimize &&
              remotesInfo.map((user, i) => (
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
              remotesInfo.map((user, i) => {
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
              {remotesInfo.map((user, i) => {
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

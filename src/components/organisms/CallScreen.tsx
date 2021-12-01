import React, { useState, useEffect, useRef, VFC, ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { getScreenStatus } from '../../stores/slices/screenStatus'
import { FewScreenArea, ScreenArea } from '../molecules'
import useSFU from './hooks/useSFU'
import { CallScreenHeader, CallScreenFooter } from '../organisms'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import Styles from '../../../styles/sass/callScreen.module.scss'
import { UserVideo, LocalVideo } from '../molecules'

const CallScreen: VFC = () => {
  const selector = useSelector((state) => state)
  const { attentionPeerId, fullScreenPeerId } = getScreenStatus(selector)
  const [isDisplay, setIsDisplay] = useState(false)
  const [isMinimize, setIsMinimize] = useState(false)
  const [isOneScreen, setIsOneScreen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const draggableRef = useRef(null)
  const [videosInfo, handles] = useSFU(setIsDisplay)
  const newRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (newRef.current) newRef.current.srcObject = videosInfo.localInfo.video
  })

  useEffect(() => {
    if (!isMinimize && !isOneScreen) setPosition({ x: 0, y: 0 })
  }, [isMinimize, isOneScreen])

  const updateIsMinimize = (isMinimize: boolean) => {
    setIsMinimize(isMinimize)
  }

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.lastX, y: data.lastY })
  }

  let fullScreenUser: false | ReactNode = false

  if (fullScreenPeerId === videosInfo.localInfo.id) {
    const { video, id } = videosInfo.localInfo
    fullScreenUser = (
      <div className={Styles.fullScreen}>
        <LocalVideo video={video} userId={id} size={{ height: '86vh' }} />
      </div>
    )
  } else if (fullScreenPeerId !== '') {
    const user = videosInfo.remotesInfo.filter(
      (remoteUser) => remoteUser.id === fullScreenPeerId
    )[0]
    fullScreenUser = (
      <div className={Styles.fullScreen}>
        <UserVideo
          video={user.video}
          userId={user.id}
          employeeStatus={user.employeeStatus}
          size={{ height: '86vh' }}
        />
      </div>
    )
  }

  let rootStyle: any = {
    width: '100%',
    left: '0px',
    top: '0px'
  }

  if (isMinimize) {
    rootStyle = {
      width: '13%',
      height: '0px',
      right: '0px',
      top: '0px'
    }
  } else if (isOneScreen) {
    rootStyle = {
      width: '20vw',
      height: 'auto',
      right: '0px',
      top: '0px'
    }
  }

  return (
    <>
      {isDisplay && (
        <Draggable
          nodeRef={draggableRef}
          position={position}
          onDrag={handleDrag}
        >
          <div ref={draggableRef} className={Styles.root} style={rootStyle}>
            <CallScreenHeader
              setIsMinimize={updateIsMinimize}
              setIsOneScreen={setIsOneScreen}
            />

            {fullScreenUser ? ( //一つの画面で全画面に表示
              { ...fullScreenUser }
            ) : isOneScreen ? ( //一つの画面のみ表示
              <div className={Styles.oneScreen}>
                <LocalVideo
                  video={videosInfo.localInfo.video}
                  userId={videosInfo.localInfo.id}
                  size={{ width: '100%' }}
                />
              </div>
            ) : (
              //全員表示 （大人数・注目｝
              <>
                {videosInfo.remotesInfo.length > 5 || attentionPeerId !== '' ? (
                  <ScreenArea
                    localInfo={videosInfo.localInfo}
                    remoteUsers={videosInfo.remotesInfo}
                    isMinimize={isMinimize}
                  />
                ) : (
                  //全員表示（少人数）
                  <FewScreenArea
                    localInfo={videosInfo.localInfo}
                    remoteUsers={videosInfo.remotesInfo}
                    isMinimize={isMinimize}
                  />
                )}
              </>
            )}
            <video
              ref={videosInfo.localInfo.videoRef}
              style={{
                visibility: 'hidden' as 'hidden',
                height: '0px',
                lineHeight: '0px',
                overflow: 'hidden',
                margin: '0px'
              }}
            ></video>
            {!isMinimize && <CallScreenFooter handles={handles} />}
          </div>
        </Draggable>
      )}
    </>
  )
}
export default CallScreen

import React, { useState, useEffect, useRef, VFC } from 'react'
import { ActionButton } from '../atoms'
import { VideoArea } from '../molecules'
import useSFU from '../../hooks/useSFU'
import { CallScreenHeader, CallScreenFooter } from '../organisms'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import Styles from '../../../styles/sass/callScreen.module.scss'

const CallScreen: VFC = () => {
  const [isDisplay, setIsDisplay] = useState(false)
  const [isMinimize, setIsMinimize] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const draggableRef = useRef(null)
  const [videosInfo, handles, testSend] = useSFU(setIsDisplay)
  const { id, video } = videosInfo.localInfo

  useEffect(() => {
    const newPosition = isMinimize ? null : { x: 0, y: 0 }
    setPosition(newPosition)
  }, [isMinimize])

  const updateIsMinimize = (isMinimize: boolean) => {
    setIsMinimize(isMinimize)
  }

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.lastX, y: data.lastY })
  }

  const rootStyle = {
    minimize: {
      width: '10%',
      right: '0px',
      top: '0px'
    },
    maximize: {
      width: '100%',
      left: '0px',
      top: '0px'
    }
  }
  const videosStyle = isMinimize
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
      {isDisplay && (
        <Draggable
          nodeRef={draggableRef}
          position={position}
          onDrag={handleDrag}
        >
          <div
            ref={draggableRef}
            className={Styles.root}
            style={isMinimize ? rootStyle.minimize : rootStyle.maximize}
          >
            <CallScreenHeader updateIsMinimize={updateIsMinimize} />
            <div className={Styles.inlineBlock} style={videosStyle}>
              <video
                width="320px"
                ref={video}
                autoPlay
                playsInline
                muted
              ></video>
            </div>
            <div className={Styles.inlineBlock} style={videosStyle}>
              <div className={Styles.videoArea}>
                {!isMinimize && (
                  <VideoArea remotesInfo={videosInfo.remotesInfo} />
                )}
              </div>
            </div>
            {!isMinimize && (
              <>
                <CallScreenFooter handles={handles} />{' '}
                <ActionButton label={'test'} onClick={testSend} />
              </>
            )}
          </div>
        </Draggable>
      )}
    </>
  )
}
export default CallScreen

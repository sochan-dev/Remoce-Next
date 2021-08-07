import React, { VFC } from 'react'
import { VideoArea } from '../molecules'
import useSFU from '../../hooks/useSFU'
import Styles from '../../../styles/sass/videoArea.module.scss'

type remoteUser = {
  id: string
  video: MediaStream
}[]

const CallScreen: VFC = () => {
  const [videosInfo, handles, isTalking] = useSFU()

  console.log('remote???', videosInfo)

  return (
    <>
      <div className={Styles.root}>
        <div>
          <p>I am:{videosInfo.localInfo.id}</p>
          <video
            width="320px"
            ref={videosInfo.localInfo.video}
            autoPlay
            playsInline
            muted
          ></video>
        </div>
        {isTalking ? <VideoArea remotesInfo={videosInfo.remotesInfo} /> : <></>}
      </div>
    </>
  )
}
export default CallScreen

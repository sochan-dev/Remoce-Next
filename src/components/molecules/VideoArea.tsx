import React, { VFC, MutableRefObject } from 'react'
import { UserVideo } from '../atoms'

type props = {
  remotesInfo: { id: string; video: MediaStream }[]
}

const VideoArea: VFC<props> = (props) => {
  const { remotesInfo } = props
  return (
    <>
      {remotesInfo.map((user, i) => (
        <UserVideo video={user.video} userId={user.id} id={i} key={i} />
      ))}
    </>
  )
}

export default VideoArea

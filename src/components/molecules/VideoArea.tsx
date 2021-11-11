import React, { VFC, MutableRefObject } from 'react'
import { UserVideo } from '../molecules'
import { RemoteUser } from '../../types/sfu'

type props = {
  remotesInfo: RemoteUser[]
}

const VideoArea: VFC<props> = (props) => {
  const { remotesInfo } = props
  return (
    <>
      {remotesInfo.map((user, i) => (
        <UserVideo
          video={user.video}
          userId={user.id}
          employeeStatus={user.employeeStatus}
          key={i}
          size={{}}
        />
      ))}
    </>
  )
}

export default VideoArea

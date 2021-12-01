import React, { VFC } from 'react'
import { UserVideo } from '../molecules'
import { RemoteUser } from '../../types/sfu'

type Props = {
  remotesInfo: RemoteUser[]
}

const VideoArea: VFC<Props> = (props) => {
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

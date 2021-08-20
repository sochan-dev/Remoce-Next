import React, { VFC, MutableRefObject } from 'react'
import { UserVideo } from '../atoms'

type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type props = {
  remotesInfo: {
    id: string
    video: MediaStream
    employeeStatus?: EmployeeStatus
  }[]
}

const VideoArea: VFC<props> = (props) => {
  console.log('---VideoAreaコンポーネント再レンダリング---', props.remotesInfo)

  const { remotesInfo } = props
  return (
    <>
      {remotesInfo.map((user, i) => (
        <UserVideo
          video={user.video}
          userId={user.id}
          employeeStatus={user.employeeStatus}
          key={i}
        />
      ))}
    </>
  )
}

export default VideoArea

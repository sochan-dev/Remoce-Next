import React, { VFC, MutableRefObject } from 'react'
import { UserVideo } from '../molecules'

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

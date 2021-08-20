import React, { useRef, useEffect, VFC } from 'react'
import Styles from '../../../styles/sass/userVideo.module.scss'

type EmployeeStatus = {
  employeeId: string
  employeeName: string
  isDisplay: boolean
  isMute: boolean
}

type props = {
  video: MediaStream
  userId: string
  employeeStatus?: EmployeeStatus
}

const UserVideo: VFC<props> = (props) => {
  console.log(
    '---UserVideoコンポーネント再レンダリング---',
    props.employeeStatus
  )
  const { video, userId, employeeStatus } = props
  const remoteRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (remoteRef.current) remoteRef.current.srcObject = video

    /*return () => {
      console.log(`${userId}のUserVideoコンポーネントがアンマウント`)
      video.getTracks().forEach((track) => track.stop())
      if (remoteRef.current) {
        console.log(
          'null代入した！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！'
        )
        remoteRef.current.srcObject = null
        remoteRef.current.remove() //アンマウントしたのちアンマウントしたことになってる？
      }
    }*/
  }, [video, userId])
  const style = {
    p: {
      fontSize: '7px'
    }
  }
  return (
    <div className={Styles.root}>
      <div className={Styles.test}>
        <p>{`peerId${userId}`}</p>
        {employeeStatus && (
          <>
            <p>{`employeeId:${employeeStatus.employeeId}`}</p>
            <p>{`name:${employeeStatus.employeeName},isDisplay:${employeeStatus.isDisplay},isMute:${employeeStatus.isMute}`}</p>
          </>
        )}
      </div>
      <video width="320px" ref={remoteRef} autoPlay playsInline></video>
    </div>
  )
}

export default UserVideo

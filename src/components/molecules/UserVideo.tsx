import React, { useRef, useEffect, useState, VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Styles from '../../../styles/sass/userVideo.module.scss'
import IconButton from '@material-ui/core/IconButton'
import FullscreenIcon from '@material-ui/icons/Fullscreen' //フルスクリーン
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit' //フルスクリーン解除
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap' //アテンションモード
import MinimizeIcon from '@material-ui/icons/Minimize' //アテンションモード解除
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined' //video-on
import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined' //video-off
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined' //volume-on
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined' //volume-off
import {
  getScreenStatus,
  setAttentionPeerId,
  setFullScreenPeerId,
  releaseAttention,
  releaseFullScreen
} from '../../stores/slices/screenStatus'

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
  size: {
    height?: string
    width?: string
    maxHeight?: string
    maxWidth?: string
  }
}

const UserVideo: VFC<props> = (props) => {
  const { video, userId, employeeStatus, size } = props
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const { attentionPeerId, fullScreenPeerId } = getScreenStatus(selector)
  const remoteRef = useRef<HTMLVideoElement>(null)
  const [isVideo, setIsVideo] = useState(false)
  const isAttention = attentionPeerId === userId
  const isFullScreen = fullScreenPeerId === userId

  useEffect(() => {
    if (remoteRef.current) remoteRef.current.srcObject = video
  }, [video, userId])

  useEffect(() => {
    if (employeeStatus) {
      if (employeeStatus.isDisplay) setIsVideo(true)
    }
  }, [employeeStatus])

  let isFooter = false
  console.log('employeeStatus', employeeStatus)
  if (
    employeeStatus &&
    'isDisplay' in employeeStatus &&
    'isMute' in employeeStatus
  ) {
    isFooter = true
  }

  const headerColor = 'error'
  const footerColor = 'error'

  return (
    <div className={Styles.root}>
      <div className={Styles.header}>
        <div>
          {isFullScreen ? (
            <IconButton onClick={() => dispatch(releaseFullScreen())}>
              <FullscreenExitIcon color={headerColor} />
            </IconButton>
          ) : (
            <IconButton onClick={() => dispatch(setFullScreenPeerId(userId))}>
              <FullscreenIcon color={headerColor} />
            </IconButton>
          )}
        </div>
        <div>
          {isAttention ? (
            <IconButton onClick={() => dispatch(releaseAttention())}>
              <MinimizeIcon color={headerColor} />
            </IconButton>
          ) : (
            <IconButton onClick={() => dispatch(setAttentionPeerId(userId))}>
              <ZoomOutMapIcon color={headerColor} />
            </IconButton>
          )}
        </div>
      </div>

      <video style={size} ref={remoteRef} autoPlay playsInline></video>

      {isFooter && (
        <>
          <div className={Styles.footer}>
            <div className={Styles.icon}>
              {employeeStatus.isDisplay ? (
                <VideocamOutlinedIcon color={footerColor} />
              ) : (
                <VideocamOffOutlinedIcon color={footerColor} />
              )}
            </div>
            <div className={Styles.icon}>
              {employeeStatus.isMute ? (
                <VolumeUpOutlinedIcon color={footerColor} />
              ) : (
                <VolumeOffOutlinedIcon color={footerColor} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default UserVideo

import React, { useRef, useEffect, VFC, MutableRefObject } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Styles from '../../../styles/sass/userVideo.module.scss'
import IconButton from '@material-ui/core/IconButton'
import FullscreenIcon from '@material-ui/icons/Fullscreen' //フルスクリーン
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit' //フルスクリーン解除
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap' //アテンションモード
import MinimizeIcon from '@material-ui/icons/Minimize' //アテンションモード解除
import {
  getScreenStatus,
  setAttentionPeerId,
  setFullScreenPeerId,
  releaseAttention,
  releaseFullScreen
} from '../../stores/slices/screenStatus'

type Props = {
  video: MediaStream
  userId: string
  size: {
    height?: string
    width?: string
    maxHeight?: string
    maxWidth?: string
  }
}
const headerColor = 'error'

const LocalVideo: VFC<Props> = (props) => {
  const { video, userId, size } = props
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const { attentionPeerId, fullScreenPeerId } = getScreenStatus(selector)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = video
  }, [video, userId])

  const isAttention = attentionPeerId === userId
  const isFullScreen = fullScreenPeerId === userId

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
      <video style={size} ref={videoRef} autoPlay muted playsInline></video>
    </div>
  )
}

export default LocalVideo

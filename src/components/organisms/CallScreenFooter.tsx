import React, { VFC } from 'react'
import IconButton from '@material-ui/core/IconButton'
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined' //video-on
import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined' //video-off
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined' //volume-on
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined' //volume-off
import ScreenShareOutlinedIcon from '@material-ui/icons/ScreenShareOutlined' //share-on
import StopScreenShareOutlinedIcon from '@material-ui/icons/StopScreenShareOutlined' //share-off
import Styles from '../../../styles/sass/callScreenFooter.module.scss'
import { useCallScreenFooter } from './hooks'

type Props = {
  handles: {
    handleShare: () => Promise<void>
    handleShareClose: () => Promise<void>
    handleTurnVideo: (isEnabled: boolean) => void
    handleTurnVoice: (isEnabled: boolean) => void
  }
}
const iconColor = 'secondary'
const CallScreenFooter: VFC<Props> = (props) => {
  const handles = props.handles
  const [userStates, handleTurnActions] = useCallScreenFooter(handles)
  return (
    <div className={Styles.root}>
      <IconButton onClick={() => handleTurnActions.onClickVideo()}>
        {userStates.turnVideo ? (
          <VideocamOutlinedIcon color={iconColor} />
        ) : (
          <VideocamOffOutlinedIcon color={iconColor} />
        )}
      </IconButton>

      <IconButton onClick={() => handleTurnActions.onClickVoice()}>
        {userStates.turnVoice ? (
          <VolumeUpOutlinedIcon color={iconColor} />
        ) : (
          <VolumeOffOutlinedIcon color={iconColor} />
        )}
      </IconButton>
      <IconButton onClick={() => handleTurnActions.onClickShare()}>
        {userStates.turnShare ? (
          <ScreenShareOutlinedIcon color={iconColor} />
        ) : (
          <StopScreenShareOutlinedIcon color={iconColor} />
        )}
      </IconButton>
    </div>
  )
}

export default CallScreenFooter

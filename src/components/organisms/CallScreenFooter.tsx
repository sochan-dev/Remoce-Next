import React, { VFC, useState, Dispatch, SetStateAction } from 'react'
import IconButton from '@material-ui/core/IconButton'
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined' //video-on
import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined' //video-off
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined' //volume-on
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined' //volume-off
import ScreenShareOutlinedIcon from '@material-ui/icons/ScreenShareOutlined' //share-on
import StopScreenShareOutlinedIcon from '@material-ui/icons/StopScreenShareOutlined' //share-off
import Styles from '../../../styles/sass/callScreenFooter.module.scss'

type props = {
  handles: {
    handleShare: () => Promise<void>
    handleShareClose: () => Promise<void>
    handleTurnVideo: (isEnabled: boolean) => void
    handleTurnVoice: (isEnabled: boolean) => void
  }
}

const CallScreenFooter: VFC<props> = (props) => {
  const [turnVideo, setTurnVideo] = useState(true)
  const [turnVoice, setTurnVoice] = useState(true)
  const [turnShare, setTurnShare] = useState(false)
  const { handleTurnVideo, handleTurnVoice, handleShare, handleShareClose } =
    props.handles

  const turnDisplay = (setState: Dispatch<SetStateAction<boolean>>) => {
    setState((beforeState) => !beforeState)
  }

  const onClickVideo = () => {
    handleTurnVideo(!turnVideo)
    turnDisplay(setTurnVideo)
  }
  const onClickVoice = () => {
    handleTurnVoice(!turnVoice)
    turnDisplay(setTurnVoice)
  }

  const onClickShare = () => {
    !turnShare ? handleShare() : handleShareClose()
    turnDisplay(setTurnShare)
  }

  return (
    <div className={Styles.root}>
      <IconButton onClick={() => onClickVideo()}>
        {turnVideo ? (
          <VideocamOutlinedIcon color={'secondary'} />
        ) : (
          <VideocamOffOutlinedIcon color={'secondary'} />
        )}
      </IconButton>

      <IconButton onClick={() => onClickVoice()}>
        {turnVoice ? (
          <VolumeUpOutlinedIcon color={'secondary'} />
        ) : (
          <VolumeOffOutlinedIcon color={'secondary'} />
        )}
      </IconButton>
      <IconButton onClick={() => onClickShare()}>
        {turnShare ? (
          <ScreenShareOutlinedIcon color={'secondary'} />
        ) : (
          <StopScreenShareOutlinedIcon color={'secondary'} />
        )}
      </IconButton>
    </div>
  )
}

export default CallScreenFooter

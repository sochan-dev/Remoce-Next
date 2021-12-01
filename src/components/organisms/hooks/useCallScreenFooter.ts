import { useState, Dispatch, SetStateAction } from 'react'

const turnDisplay = (setState: Dispatch<SetStateAction<boolean>>) => {
  setState((beforeState) => !beforeState)
}

const useCallScreenFooter = (handles: {
  handleShare: () => Promise<void>
  handleShareClose: () => Promise<void>
  handleTurnVideo: (isEnabled: boolean) => void
  handleTurnVoice: (isEnabled: boolean) => void
}) => {
  const { handleTurnVideo, handleTurnVoice, handleShare, handleShareClose } =
    handles
  const [turnVideo, setTurnVideo] = useState(true)
  const [turnVoice, setTurnVoice] = useState(true)
  const [turnShare, setTurnShare] = useState(false)

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

  const handleTurnActions = {
    onClickVideo: onClickVideo,
    onClickVoice: onClickVoice,
    onClickShare: onClickShare
  }
  const userStates = {
    turnVideo: turnVideo,
    turnVoice: turnVoice,
    turnShare: turnShare
  }
  return [userStates, handleTurnActions] as const
}

export default useCallScreenFooter

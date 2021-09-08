import React, { VFC, Dispatch, SetStateAction } from 'react'
import MinimizeIcon from '@material-ui/icons/Minimize'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'
import Crop54Icon from '@material-ui/icons/Crop54'
import IconButton from '@material-ui/core/IconButton'
import Styles from '../../../styles/sass/callScreenHeader.module.scss'

type props = {
  setIsMinimize: Dispatch<SetStateAction<boolean>>
  setIsOneScreen: Dispatch<SetStateAction<boolean>>
}

const CallScreenHeader: VFC<props> = (props) => {
  const { setIsMinimize, setIsOneScreen } = props

  const updateMinimize = () => {
    setIsMinimize(true)
    setIsOneScreen(false)
  }

  const releaseMinimize = () => {
    setIsMinimize(false)
    setIsOneScreen(false)
  }

  const updateOneScreen = () => {
    setIsOneScreen((beforeState) => !beforeState)
    setIsMinimize(false)
  }

  return (
    <div className={Styles.root}>
      <IconButton onClick={() => updateMinimize()}>
        <MinimizeIcon />
      </IconButton>
      <IconButton onClick={() => releaseMinimize()}>
        <ZoomOutMapIcon />
      </IconButton>
      <IconButton onClick={() => updateOneScreen()}>
        <Crop54Icon />
      </IconButton>
    </div>
  )
}

export default CallScreenHeader

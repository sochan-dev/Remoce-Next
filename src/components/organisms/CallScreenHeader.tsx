import React, { VFC } from 'react'
import MinimizeIcon from '@material-ui/icons/Minimize'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'
import IconButton from '@material-ui/core/IconButton'
import Styles from '../../../styles/sass/callScreenHeader.module.scss'

type props = {
  updateIsMinimize: (boolean) => void
}

const CallScreenHeader: VFC<props> = (props) => {
  const updateIsMinimize = props.updateIsMinimize

  return (
    <div className={Styles.root}>
      <IconButton
        onClick={() => {
          updateIsMinimize(true)
        }}
      >
        <MinimizeIcon />
      </IconButton>
      <IconButton onClick={() => updateIsMinimize(false)}>
        <ZoomOutMapIcon />
      </IconButton>
    </div>
  )
}

export default CallScreenHeader

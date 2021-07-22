import React, { VFC } from 'react'
import Button from '@material-ui/core/Button'
import Styles from '../../../styles/sass/actionButton.module.scss'
import classNames from 'classnames'
type props = {
  w?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  label: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const ActionButton: VFC<props> = (props) => {
  return (
    <Button
      onClick={props.onClick}
      className={classNames(Styles.root, Styles[`w_${props.w}`])}
    >
      {props.label}
    </Button>
  )
}
ActionButton.defaultProps = {
  w: 100
}
export default ActionButton

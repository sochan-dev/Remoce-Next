import React, { useState, ChangeEvent, VFC } from 'react'
import Styles from '../../../styles/sass/textArea.module.scss'
import classNames from 'classnames'

type props = {
  w?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  value: string
  label: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const TextArea: VFC<props> = (props) => {
  const [isActive, setIsActive] = useState(false)
  const handleOnFocus = () => setIsActive(!isActive)

  return (
    <div className={classNames(Styles.root, Styles[`w_${props.w}`])}>
      <label
        htmlFor={props.label}
        className={
          !isActive && props.value === ''
            ? Styles.root__label
            : Styles.root__label_active
        }
      >
        {props.label}
      </label>
      <textarea
        id={props.label}
        value={props.value}
        onChange={props.onChange ? (e) => props.onChange(e) : undefined}
        onFocus={() => handleOnFocus()}
        onBlur={() => handleOnFocus()}
      />
    </div>
  )
}

TextArea.defaultProps = {
  w: 100
}
export default TextArea

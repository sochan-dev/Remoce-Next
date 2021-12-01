import React, { useState, ChangeEvent, forwardRef, Ref } from 'react'
import Styles from '../../../styles/sass/inputText.module.scss'
import classNames from 'classnames'

type Props = {
  type?: 'text' | 'number' | 'password' | 'email'
  w?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
  value: string
  label: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const InputText = forwardRef(function (
  props: Props,
  ref: Ref<HTMLInputElement>
) {
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
      <input
        type={props.type}
        id={props.label}
        value={props.value}
        onChange={props.onChange ? (e) => props.onChange(e) : undefined}
        onFocus={() => handleOnFocus()}
        onBlur={() => handleOnFocus()}
        ref={ref}
      />
    </div>
  )
})

InputText.defaultProps = {
  type: 'text',
  w: 100
}
export default InputText

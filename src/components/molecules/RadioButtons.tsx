import React, { VFC, ChangeEvent } from 'react'
import Styles from '../../../styles/sass/radioButtons.module.scss'

type props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  name: string
  radioList: {
    id: number
    value: string | number
    label: string
    isChecked?: boolean
  }[]
}

const RadioButtons: VFC<props> = (props) => {
  const { radioList, name, onChange } = props
  return (
    <>
      {radioList.map((radio, i) => (
        <div className={Styles.md_radio} key={i}>
          <input
            name={name}
            id={`${name}-${radio.id}`}
            type="radio"
            value={radio.value}
            onChange={onChange}
            checked={radio.isChecked}
          />
          <label htmlFor={`${name}-${radio.id}`}>{radio.label}</label>
        </div>
      ))}
    </>
  )
}
export default RadioButtons

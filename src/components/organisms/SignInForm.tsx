import React, { VFC, useState, ChangeEvent } from 'react'
import { InputText } from '../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'

const SignInForm: VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const inputEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const inputPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <>
      <h1>サインイン</h1>
      <InputText
        label={'メールアドレス'}
        type={'text'}
        value={email}
        onChange={inputEmail}
      />
      <div className={Blanks.blank_32} />
      <InputText
        label={'password'}
        type={'text'}
        value={password}
        onChange={inputPassword}
      />
    </>
  )
}

export default SignInForm

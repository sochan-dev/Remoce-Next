import React, { VFC, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { InputText, ActionButton } from '../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'

import { signIn, signUp } from '../../stores/slices/authStatusSlice'

const SignUpForm: VFC = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const inputEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const inputPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleRegister = () => {
    dispatch(signUp({ email: email, password: password }))
  }

  const handleSignIn = () => {
    dispatch(signIn({ email: email, password: password }))
  }

  return (
    <>
      <h1>サインアップ</h1>
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
      <div className={Blanks.blank_32} />
      <ActionButton label={'サインアップ'} onClick={handleRegister} />
      <div className={Blanks.blank_16} />
      <ActionButton label={'サインイン'} onClick={handleSignIn} />
    </>
  )
}

export default SignUpForm

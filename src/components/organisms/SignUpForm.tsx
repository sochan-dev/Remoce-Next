import React, { VFC, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { InputText, ActionButton } from '../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'

import { useSignInUp } from './hooks'

const SignUpForm: VFC = () => {
  const [values, formControls, handles] = useSignInUp()

  return (
    <>
      <h1>サインアップ</h1>
      <InputText
        label={'メールアドレス'}
        type={'text'}
        value={values.email}
        onChange={formControls.inputEmail}
      />
      <div className={Blanks.blank_32} />
      <InputText
        label={'password'}
        type={'text'}
        value={values.password}
        onChange={formControls.inputPassword}
      />
      <div className={Blanks.blank_32} />
      <ActionButton label={'サインアップ'} onClick={handles.handleRegister} />
      <div className={Blanks.blank_16} />
      <ActionButton label={'サインイン'} onClick={handles.handleSignIn} />
    </>
  )
}

export default SignUpForm

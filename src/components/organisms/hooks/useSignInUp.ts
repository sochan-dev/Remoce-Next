import React, { VFC, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { InputText, ActionButton } from '../../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'
import { signIn, signUp } from '../../../stores/slices/authStatusSlice'

const useSignInUp = () => {
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

  const values = {
    email: email,
    password: password
  }
  const formControls = {
    inputEmail: inputEmail,
    inputPassword: inputPassword
  }
  const handles = {
    handleRegister: handleRegister,
    handleSignIn: handleSignIn
  }
  return [values, formControls, handles] as const
}

export default useSignInUp

import React, { VFC } from 'react'
import { SignUpForm } from '../organisms'
import Styles from '../../../styles/sass/signForm.module.scss'
const SignUpTemplate: VFC = () => {
  return (
    <main className={Styles.root}>
      <div className={Styles.main}>
        <SignUpForm />
      </div>
    </main>
  )
}

export default SignUpTemplate

import React, { VFC } from 'react'
import { SignUpForm, SignInForm } from '../organisms'
import Styles from '../../../styles/sass/signForm.module.scss'
const SignUpOrSignInForm: VFC = () => {
  return (
    <main className={Styles.root}>
      <div className={Styles.main}>
        <div className={Styles.contentArea}>f</div>
        <div className={Styles.formArea}>
          <SignUpForm />
        </div>
      </div>
    </main>
  )
}

export default SignUpOrSignInForm

import React, { VFC } from 'react'
import Router from 'next/router'
import { auth } from '../../../firebase'
import Styles from '../../../styles/sass/Home.module.scss'
import {
  CreateOfficeForm,
  ShowOfficeArea,
  ShowInvitedOfficeArea
} from '../../components/organisms'

const HomeTemplate: VFC = () => {
  const logout = async () => {
    await auth.signOut().then(() => {
      Router.push('/')
    })
  }
  return (
    <main className={Styles.root}>
      <div className={Styles.main}>
        <div className={Styles.menuArea}>
          <button onClick={logout}>ログアウト</button>
        </div>
        <div className={Styles.contentArea}>
          <ShowInvitedOfficeArea />
          <ShowOfficeArea />
          <CreateOfficeForm />
        </div>
      </div>
    </main>
  )
}

export default HomeTemplate

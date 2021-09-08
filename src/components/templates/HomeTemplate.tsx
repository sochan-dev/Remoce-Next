import React, { VFC } from 'react'
import Router from 'next/router'
import { auth } from '../../../firebase'
import Styles from '../../../styles/sass/Home.module.scss'
import {
  HomeHeader,
  CreateOfficeForm,
  ShowOfficeArea,
  ShowInvitedOfficeArea
} from '../../components/organisms'

const HomeTemplate: VFC = () => {
  return (
    <main className={Styles.root}>
      <div className={Styles.header}>
        <HomeHeader />
      </div>
      <div className={Styles.main}>
        <div className={Styles.contentArea}>
          <ShowOfficeArea />
        </div>
      </div>
    </main>
  )
}

export default HomeTemplate

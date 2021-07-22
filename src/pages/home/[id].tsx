import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import Router from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { db, auth } from '../../../firebase'
import Styles from '../../../styles/sass/Home.module.scss'
import { CreateOfficeForm } from '../../components/organisms'
import { authentication } from '../../stores/slices/authStatusSlice'

type props = InferGetStaticPropsType<typeof getStaticProps>
type sendData = {
  employeeId: string
  employeeName: string
  officeId: string
  officeName: string
  officePicture?: string
}[]
type employeeData = {
  employeeId: string
  employeeName: string
  officeId: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }) => {
  console.log('hello')
  await auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('認証成功ー[id]')
    } else {
      console.log('認証失敗ー[id]')
    }
  })
  const uid = params.id
  const sendData: sendData = []
  /*
  const employees = await db
    .collection('users')
    .doc(uid)
    .collection('employees')
    .get()

  if (!employees.empty) {
    employees.forEach(async (employee) => {
      const employeeData = employee.data() as employeeData

      const officeData = await db
        .collection('offices')
        .doc(employeeData.employeeId)
        .get()

      sendData.push({
        ...employeeData,
        officeName: officeData.data().office_name,
        officePicture: officeData.data().office_picture
      })
    })
  }*/
  //ストレージからオフィスの画像を取得する処理ここに挟む
  return {
    props: { uid: uid, data: sendData },
    revalidate: 1
  }
}

const HomePage: NextPage<props> = (props) => {
  console.log('ここまでは行ってる')
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authentication())
  }, [])

  const logout = async () => {
    console.log('実行')
    await auth.signOut().then(() => {
      Router.push('/')
    })
  }

  return (
    <main className={Styles.root}>
      <div className={Styles.main}>
        <div className={Styles.menuArea}>
          <button onClick={logout}></button>
        </div>
        <div className={Styles.contentArea}>
          <CreateOfficeForm />
        </div>
      </div>
    </main>
  )
}

export default HomePage

import { NextPage, InferGetStaticPropsType } from 'next'
import Router from 'next/router'
import React, { useEffect } from 'react'
import { auth } from '../../firebase'
import { SignUpTemplate } from '../components/templates'

type props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  return {
    props: {},
    revalidate: 30
  }
}

const SignUp: NextPage<props> = () => {
  useEffect(() => {
    console.log('認証')
    auth.onAuthStateChanged((user) => {
      user && Router.push(`/home/${user.uid}`)
    })
  }, [])

  return (
    <>
      <SignUpTemplate />
    </>
  )
}

export default SignUp

import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import Router from 'next/router'
import React, { useEffect, createContext } from 'react'
import { useDispatch } from 'react-redux'
import { HomeTemplate } from '../../components/templates'
import { sdb } from '../../../ServerSideApp'
import { authentication } from '../../stores/slices/authStatusSlice'

type props = InferGetStaticPropsType<typeof getStaticProps>
type OfficeDataList = {
  employee_id: string
  employee_name: string
  office_id: string
  office_name: string
  office_picture?: string | false
}[]
type employeeData = {
  employee_id: string
  employee_name: string
  office_id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }) => {
  const uid = params.user_id
  const sendData: OfficeDataList = []
  let errFlg = false
  await sdb
    .collection('users')
    .doc(uid)
    .collection('employee_to_office')
    .get()
    .then(async (snapshot) => {
      for await (let childSnapshot of snapshot.docs) {
        const employee = childSnapshot.data() as employeeData
        await sdb
          .collection('offices')
          .doc(employee.office_id)
          .get()
          .then((snapshot) => {
            sendData.push({
              ...employee,
              office_name: snapshot.data().office_name,
              office_picture: snapshot.data().office_picture
                ? snapshot.data().office_picture
                : false
            })
          })
      }
    })
    .catch((e) => {})

  //ストレージからオフィスの画像を取得する処理ここに挟む
  if (!errFlg) {
    return {
      props: { uid: uid, data: sendData },
      revalidate: 1
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }
}

export const BelongOfficeListContext = createContext<OfficeDataList>([])

const HomePage: NextPage<props> = (props) => {
  const dispatch = useDispatch()
  const uid = props.uid
  const belongOfficeList = props.data
  useEffect(() => {
    dispatch(authentication())
  }, [])

  return (
    <>
      <BelongOfficeListContext.Provider value={belongOfficeList}>
        <HomeTemplate />
      </BelongOfficeListContext.Provider>
    </>
  )
}

export default HomePage

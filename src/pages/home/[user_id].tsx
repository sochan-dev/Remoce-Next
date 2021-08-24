import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HomeTemplate } from '../../components/templates'
import { sdb } from '../../../ServerSideApp'
import { db } from '../../../firebase'
import { authentication } from '../../stores/slices/authStatusSlice'
import { fetchWorkPlaces } from '../../stores/slices/workPlacesSlice'
import { fetchInvites } from '../../stores/slices/notificationsSlice'

type props = InferGetStaticPropsType<typeof getStaticProps>
type OfficeDataList = {
  employeeId: string
  employeeName: string
  officeId: string
  officeName: string
  officePicture?: string | false
}[]
type employeeData = {
  employee_id: string
  employee_name: string
  office_id: string
}
type InvitedOfficeList = {
  officeId: string
  officeName: string
  officePicture?: string | false
}[]
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }) => {
  const uid = params.user_id
  const belongOfficeList: OfficeDataList = []
  const invitedOfficeList: InvitedOfficeList = []
  let errFlg = false
  await sdb
    .collection('users')
    .doc(uid)
    .collection('employee_to_office')
    .get()
    .then(async (snapshot) => {
      if (!snapshot.empty) {
        for await (let childSnapshot of snapshot.docs) {
          const employee = childSnapshot.data() as employeeData
          await sdb
            .collection('offices')
            .doc(employee.office_id)
            .get()
            .then((snapshot) => {
              belongOfficeList.push({
                employeeId: employee.employee_id,
                employeeName: employee.employee_name,
                officeId: employee.office_id,
                officeName: snapshot.data().office_name,
                officePicture: snapshot.data().office_picture
                  ? snapshot.data().office_picture
                  : false
              })
            })
        }
      }
    })

    .catch((e) => {
      errFlg = true
    })

  //

  await sdb
    .collection('users')
    .doc(uid)
    .get()
    .then(async (snapshot) => {
      if (Object.keys(snapshot.data()).length !== 0) {
        for await (let officeId of snapshot.data().invited_office) {
          await sdb
            .collection('offices')
            .doc(officeId)
            .get()
            .then((officeData) => {
              invitedOfficeList.push({
                officeId: officeId,
                officeName: officeData.data().office_name
              })
            })
        }
      }
    })

  //ストレージからオフィスの画像を取得する処理ここに挟む
  if (!errFlg) {
    return {
      props: {
        uid: uid,
        belongOfficeList: belongOfficeList,
        invitedOfficeList: invitedOfficeList
      },
      revalidate: 600
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

const HomePage: NextPage<props> = (props) => {
  const dispatch = useDispatch()
  const { belongOfficeList, invitedOfficeList } = props

  useEffect(() => {
    dispatch(fetchWorkPlaces(belongOfficeList))
    dispatch(fetchInvites(invitedOfficeList))
  }, [])

  useEffect(() => {
    dispatch(authentication())
  }, [])

  return (
    <>
      <HomeTemplate />
    </>
  )
}

export default HomePage

import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import React from 'react'
import { HomeTemplate } from '../../components/templates'
import { sdb } from '../../../ServerSideApp'
import { NotificationData } from '../../types/notification'
import { WorkPlaceData, WorkPlace_data } from '../../types/workPlace'
import { useHomePageInitialize } from '../hooks'

type Props = InferGetStaticPropsType<typeof getStaticProps>
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }) => {
  const uid = params.user_id
  const belongOfficeList: WorkPlaceData[] = []
  const invitedOfficeList: NotificationData['invites'] = []
  let errFlg = false
  await sdb
    .collection('users')
    .doc(uid)
    .collection('employee_to_office')
    .get()
    .then(async (snapshot) => {
      if (!snapshot.empty) {
        for await (let childSnapshot of snapshot.docs) {
          const employee = childSnapshot.data() as WorkPlace_data
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

const HomePage: NextPage<Props> = (props) => {
  const { belongOfficeList, invitedOfficeList, uid } = props
  useHomePageInitialize(belongOfficeList, invitedOfficeList, uid)
  return (
    <>
      <HomeTemplate />
    </>
  )
}

export default HomePage

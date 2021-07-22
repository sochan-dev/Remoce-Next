import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import Router from 'next/router'
import React, { useEffect } from 'react'
import { db } from '../../../../firebase'

type props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }) => {
  const officeId = params.office_id
  const employeeId = params.employee_id
  let isSuccess: boolean
  db.collection('offices')
    .doc('nLC6aePMc4Z6L7BR1OzX')
    .update({
      office_name: 'seikou'
    })
    .then(() => {
      console.log('成功')
      isSuccess = true
    })
    .catch((e) => {
      console.log('失敗j', e)
      isSuccess = false
    })

  if (isSuccess) {
    return {
      props: {
        office_id: params.office_id,
        employee_id: params.employee_id
      },
      revalidate: 30
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

const Office: NextPage<props> = (props) => {
  return <>{`office_id:${props.office_id},employee_id:${props.employee_id}`}</>
}

export default Office

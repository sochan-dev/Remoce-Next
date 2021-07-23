import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import Router from 'next/router'
import { type } from 'os'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { db } from '../../../../firebase'
import { OfficeTemplate } from '../../../components/templates'
import {
  fetchEmployees,
  EmployeesStatus
} from '../../../stores/slices/employeesStatusSlice'

type props = InferGetStaticPropsType<typeof getStaticProps>

type OfficeData = {}
type EmployeeData = {
  employee_id: string
  employee_name: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

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
  let officeData: OfficeData
  let employeeList = []
  await db
    .collection('offices')
    .doc(officeId)
    .get()
    .then(async (data) => {
      officeData = data.data()
      await db
        .collection('offices')
        .doc(officeId)
        .collection('employees')
        .get()
        .then((employeesData) => {
          employeesData.forEach((employee) => {
            const employeeData = employee.data() as EmployeeData
            employeeList.push({
              employeeId: employee.id,
              employeeName: employeeData.employee_name,
              xCoordinate: employeeData.employee_x_coordinate,
              yCoordinate: employeeData.employee_y_coordinate
            })
          })
        })
      isSuccess = true
    })
    .catch((e) => {
      console.log('失敗', e)
      isSuccess = false
    })

  if (isSuccess) {
    return {
      props: {
        officeId: officeId,
        yourEmployeeId: employeeId,
        officeData: officeData,
        employeeList: employeeList
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
  console.log('Office再レンダリング')
  console.log(
    'officeData->',
    props.officeData,
    'employeeList->',
    props.employeeList
  )

  const dispatch = useDispatch()
  const payload: EmployeesStatus = { employees: props.employeeList }
  dispatch(fetchEmployees(payload))

  return (
    <div>
      <p>{`office_id:${props.officeId},あなたのemployee_id:${props.yourEmployeeId}`}</p>
      <OfficeTemplate />
    </div>
  )
}

export default Office

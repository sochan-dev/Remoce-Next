import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { db } from '../../../../firebase'
import { sdb } from '../../../../ServerSideApp'
import { OfficeTemplate } from '../../../components/templates'
import {
  fetchEmployeesStatus,
  fetchEmployees,
  addEmployee
} from '../../../stores/slices/employeesStatusSlice'
import { fetchOffice } from '../../../stores/slices/officeStatusSlice'

type props = InferGetStaticPropsType<typeof getStaticProps>
type OfficeData = {
  office_name: string
}
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

  await sdb
    .collection('offices')
    .doc(officeId)
    .collection('employees')
    .doc(employeeId)
    .update({
      is_office: true
    })
    .catch((e) => {
      isSuccess = false
    })

  await sdb
    .collection('offices')
    .doc(officeId)
    .get()
    .then(async (data) => {
      officeData = data.data() as OfficeData
      await sdb
        .collection('offices')
        .doc(officeId)
        .collection('employees')
        .where('is_office', '==', true)
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
    console.log('employeeList', employeeList)
    return {
      props: {
        officeData: { officeId: officeId, officeName: officeData.office_name },
        yourEmployeeId: employeeId,
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
  const { officeData, yourEmployeeId, employeeList } = props
  console.log('officeData->', officeData, 'employeeList->', employeeList)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      fetchEmployeesStatus({
        yourId: yourEmployeeId,
        employees: employeeList
      })
    )
    dispatch(fetchOffice(officeData))

    const leave = async () => {
      await db
        .collection('offices')
        .doc(officeData.officeId)
        .collection('employees')
        .doc(yourEmployeeId)
        .update({
          is_office: false
        })
    }

    return () => {
      leave()
    }
  }, [])

  useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeData.officeId)
      .collection('employees')
      .where('is_office', '==', false)
      .onSnapshot(async (snapshot) => {
        console.log('出社or退社or入社')
        const empList = []
        await db
          .collection('offices')
          .doc(officeData.officeId)
          .collection('employees')
          .where('is_office', '==', true)
          .get()
          .then((employeesData) => {
            employeesData.forEach((employee) => {
              const employeeData = employee.data() as EmployeeData
              empList.push({
                employeeId: employee.id,
                employeeName: employeeData.employee_name,
                xCoordinate: employeeData.employee_x_coordinate,
                yCoordinate: employeeData.employee_y_coordinate
              })
            })
            console.log('出社してる人', empList)
            dispatch(fetchEmployees(empList))
          })
      })

    return unsubscribe
  }, [])

  /*useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeData.officeId)
      .collection('employees')
      .onSnapshot(async (snapshots) => {
        snapshots.docChanges().forEach((snapshot) => {
          const em = snapshot.doc.data() as EmployeeData
          console.log('type', snapshot.type)
          if (snapshot.type === 'added') {
            console.log('入社！！', em.employee_name)
            dispatch(
              addEmployee({
                employeeId: em.employee_id,
                employeeName: em.employee_name,
                xCoordinate: em.employee_x_coordinate,
                yCoordinate: em.employee_y_coordinate
              })
            )
          }
        })
      })

    return unsubscribe
  }, [])*/

  return (
    <div>
      <p>{`office_id:${officeData.officeId},あなたのemployee_id:${yourEmployeeId}`}</p>
      <OfficeTemplate />
    </div>
  )
}

export default Office

/*useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeData.officeId)
      .collection('employees')
      .where('is_office', '==', true)
      .onSnapshot((snapshot) => {
        console.log('検知！！！！！！！！！！！！！！！！！！！！！！')
        const emps: EmployeesStatus['employees'] = []
        snapshot.forEach((employee) => {
          console.log('????', employee.data(), employee.id)
          const employeeData = employee.data() as EmployeeData
          emps.push({
            employeeId: employee.id,
            employeeName: employeeData.employee_name,
            xCoordinate: employeeData.employee_x_coordinate,
            yCoordinate: employeeData.employee_y_coordinate
          })
        })
        console.log('emp', emps)
        
        dispatch(fetchEmployees(emps))
      })

    return unsubscribe
  }, [])*/

/*const empList: {}[] = []
        console.log(snapshot)
        snapshot.forEach((employee) => {
          const emp = employee.data() as EmployeeData
          console.log('ed', emp)
          empList.push({
            employeeId: employee.id,
            employeeName: emp.employee_name,
            xCoordinate: emp.employee_x_coordinate,
            yCoordinate: emp.employee_y_coordinate
          })
        })
        console.log('hello', empList)*/

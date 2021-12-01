import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import React from 'react'
import { sdb, sRealtimeDB } from '../../../../ServerSideApp'
import { OfficeTemplate } from '../../../components/templates'
import { EmployeeData, Employee_data } from '../../../types/employee'
import { FurnitureData, Furniture_data } from '../../../types/furniture'
import { Room_data } from '../../../types/room'
import { CheckMediaDeviceRight } from '../../../components/containments'
import { useOfficePageInitialize } from '../../hooks'

type Props = InferGetStaticPropsType<typeof getStaticProps>
type OfficeData = {
  office_name: string
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
  let employeeList: EmployeeData[] = []
  const roomList = []
  const furnitureList: FurnitureData[] = []

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
            const employeeData = employee.data() as Employee_data

            employeeList.push({
              employeeId: employee.id,
              employeeName: employeeData.employee_name,
              employeePicture: employeeData.employee_picture,
              editPermission: employeeData.edit_permission,
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

  await sdb
    .collection('offices')
    .doc(officeId)
    .collection('room')
    .doc('room')
    .get()
    .then((snapshots) => {
      const data = snapshots.data() as { rooms: Room_data[] }
      const roomData = data.rooms

      roomData.forEach((room) => {
        roomList.push({
          roomId: room.room_id,
          roomX: room.x_coordinate,
          roomY: room.y_coordinate
        })
      })
    })
    .catch((e) => {
      console.log(e)
      isSuccess = false
    })

  await sdb
    .collection('offices')
    .doc(officeId)
    .collection('furniture')
    .get()
    .then((snapshots) => {
      snapshots.forEach((snapshot) => {
        const furniture = snapshot.data() as Furniture_data
        furnitureList.push({
          furnitureId: snapshot.id,
          roomId: furniture.room_id,
          furnitureName: furniture.furniture_name,
          furnitureDetail: furniture.furniture_detail,
          furnitureSize: furniture.furniture_size,
          furnitureColor: furniture.furniture_color,
          isClose: furniture.is_close,
          authorities: furniture.authorities,
          xCoordinate: furniture.x_coordinate,
          yCoordinate: furniture.y_coordinate,
          joinEmployees: furniture.join_employees
        })
      })
    })

  const statusRef = sRealtimeDB.ref(`status/${employeeId}`)

  if (isSuccess) {
    await statusRef.update({
      status: true
    })
    return {
      props: {
        officeData: { officeId: officeId, officeName: officeData.office_name },
        yourEmployeeId: employeeId,
        employeeList: employeeList,
        roomList: roomList,
        furnitureList: furnitureList
      },
      revalidate: 30
    }
  } else {
    await statusRef.update({
      status: false
    })
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }
}

const Office: NextPage<Props> = (props) => {
  const { officeData, yourEmployeeId, employeeList, roomList, furnitureList } =
    props

  useOfficePageInitialize(
    officeData,
    yourEmployeeId,
    employeeList,
    roomList,
    furnitureList
  )

  return (
    <CheckMediaDeviceRight>
      <div>
        <OfficeTemplate />
      </div>
    </CheckMediaDeviceRight>
  )
}

export default Office

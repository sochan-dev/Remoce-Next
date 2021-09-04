import { NextPage, InferGetStaticPropsType, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db, realTimeDB } from '../../../../firebase'
import { sdb, sRealtimeDB } from '../../../../ServerSideApp'
import { OfficeTemplate } from '../../../components/templates'
import {
  fetchEmployeesStatus,
  fetchEmployees,
  asyncFetchEmployees,
  getEmployeeId,
  fetchEmployeeId
} from '../../../stores/slices/employeesStatusSlice'
import {
  asyncFetchFurniture,
  fetchFurniture
} from '../../../stores/slices/furnitureStatusSlice'
import {
  asyncFetchOffice,
  fetchOffice,
  getOfficeId,
  setScrollValue
} from '../../../stores/slices/officeStatusSlice'
import {
  asyncFetchRooms,
  fetchRooms
} from '../../../stores/slices/roomsStatusSlice'
import { customAxios } from '../../../components/organisms/utils/customAxios'

type props = InferGetStaticPropsType<typeof getStaticProps>
type OfficeData = {
  office_name: string
}
type Employee_data = {
  employee_name: string
  employee_picture: string
  edit_permission: boolean
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type EmployeeData = {
  employeeId: string
  employeeName: string
  employeePicture: string
  editPermission: boolean
  xCoordinate: number
  yCoordinate: number
}

type RoomsData = {
  rooms: {
    room_id: string
    x_coordinate: number
    y_coordinate: number
    join_employees: string[]
  }[]
}

type Furniture = {
  room_id: string
  furniture_name: string
  furniture_detail: string
  furniture_size: number
  furniture_color: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  is_close: boolean
  authorities: string[]
  x_coordinate: number
  y_coordinate: number
  join_employees: []
}

type FurnitureList = {
  furnitureId: string
  roomId: string
  furnitureName: string
  furnitureDetail: string
  furnitureSize: number
  furnitureColor: 'white' | 'black' | 'red' | 'blue' | 'yellow' | 'green'
  isClose: boolean
  authorities: string[]
  xCoordinate: number
  yCoordinate: number
  joinEmployees: []
}[]

type PutRequest = {
  isExit: boolean
  officeId: string
  employeeId: string
}

const URL = 'https://asia-northeast1-remoce-7a22f.cloudfunctions.net/remoce/'

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
  const furnitureList: FurnitureList = []

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
      const data = snapshots.data() as RoomsData
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
      isSuccess = false
    })

  await sdb
    .collection('offices')
    .doc(officeId)
    .collection('furniture')
    .get()
    .then((snapshots) => {
      snapshots.forEach((snapshot) => {
        const furniture = snapshot.data() as Furniture
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

const Office: NextPage<props> = (props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  /*const { officeData, yourEmployeeId, employeeList, roomList, furnitureList } =
    props
  const officeId = getOfficeId(selector)
  const employeeId = getEmployeeId(selector)*/
  const officeId = router.query.office_id as string
  const employeeId = router.query.employee_id as string

  useEffect(() => {
    console.log('useEffect-------------1')
    //ISRで取得したデータをstoreに格納
    /*dispatch(
      fetchEmployeesStatus({
        yourId: yourEmployeeId,
        employees: employeeList
      })
    )
    dispatch(fetchOffice(officeData))
    dispatch(fetchRooms(roomList))
    dispatch(fetchFurniture(furnitureList))*/

    const leave = async () => {
      const employeeReq: PutRequest = {
        isExit: true,
        officeId: officeId,
        employeeId: employeeId
      }
      const employeeReqJSON = JSON.stringify(employeeReq)
      let employeeParams = new URLSearchParams()
      employeeParams.append('data', employeeReqJSON)
      customAxios.defaults.withCredentials = true
      customAxios.put(`${URL}employee`, employeeParams, {
        withCredentials: true
      })
    }

    return () => {
      leave()
    }
  }, [])

  useEffect(() => {
    console.log('useEffect-------------1.5!!!')
    const employeeReq: PutRequest = {
      isExit: false,
      officeId: router.query.office_id as string,
      employeeId: router.query.employee_id as string
    }
    const employeeReqJSON = JSON.stringify(employeeReq)
    console.log('employeeReq', employeeReq)
    let employeeParams = new URLSearchParams()
    employeeParams.append('data', employeeReqJSON)
    customAxios.defaults.withCredentials = true
    customAxios.put(`${URL}employee`, employeeParams, {
      withCredentials: true
    })
  }, [])

  useEffect(() => {
    console.log('useEffect-------------2')
    if (officeId !== '' || employeeId !== '') {
      realTimeDB
        .ref(`status/${employeeId}`)
        .update({
          status: true
        })
        .then(() => {
          realTimeDB.ref(`status/${employeeId}`).onDisconnect().update({
            status: false
          })
        })
    }
  }, [officeId, employeeId])

  useEffect(() => {
    console.log('useEffect-------------3')
    //スクロールした座標を更新
    const scrollAction = () => {}
    window.addEventListener('scroll', () => {
      dispatch(setScrollValue({ x: window.scrollX, y: window.scrollY }))
    })

    return window.removeEventListener('scroll', scrollAction)
  }, [])

  useEffect(() => {
    console.log('useEffect-------------4')
    dispatch(asyncFetchOffice(officeId))
    dispatch(fetchEmployeeId(employeeId))
    dispatch(asyncFetchEmployees(officeId))
    dispatch(asyncFetchRooms(officeId))
    dispatch(asyncFetchFurniture(officeId))
  }, [])

  useEffect(() => {
    console.log('useEffect-------------5')
    const unsubscribe = db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .where('is_office', '==', false)
      .onSnapshot(async (snapshot) => {
        console.log('出社or退社or入社')
        const empList = []
        await db
          .collection('offices')
          .doc(officeId)
          .collection('employees')
          .where('is_office', '==', true)
          .get()
          .then((employeesData) => {
            employeesData.forEach((employee) => {
              const employeeData = employee.data() as Employee_data
              empList.push({
                employeeId: employee.id,
                employeeName: employeeData.employee_name,
                employeePicture: employeeData.employee_picture,
                editPermission: employeeData.edit_permission,
                xCoordinate: employeeData.employee_x_coordinate,
                yCoordinate: employeeData.employee_y_coordinate
              })
            })
            dispatch(fetchEmployees(empList))
          })
      })

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeId)
      .collection('room')
      .doc('room')
      .onSnapshot(async (snapshot) => {
        const rooms = snapshot.data().rooms as RoomsData['rooms']
        const roomList = rooms.map((room) => {
          return {
            roomId: room.room_id,
            roomX: room.x_coordinate,
            roomY: room.y_coordinate,
            joinEmployees: room.join_employees
          }
        })
        dispatch(fetchRooms(roomList))
      })
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeId)
      .collection('furniture')
      .onSnapshot(async (snapshots) => {
        const furnitureList: FurnitureList = []
        snapshots.forEach((snapshot) => {
          const furniture = snapshot.data() as Furniture
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
        dispatch(fetchFurniture(furnitureList))
      })
    return unsubscribe
  }, [])

  return (
    <div>
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

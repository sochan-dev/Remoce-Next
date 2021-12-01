import { EmployeeData } from './../../types/employee'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { db, realTimeDB } from '../../../firebase'
import {
  fetchEmployees,
  asyncFetchEmployees,
  fetchEmployeeId,
  fetchEmployeesStatus
} from '../../stores/slices/employeesStatusSlice'
import {
  asyncFetchFurniture,
  fetchFurniture
} from '../../stores/slices/furnitureStatusSlice'
import {
  asyncFetchOffice,
  fetchOffice,
  setScrollValue
} from '../../stores/slices/officeStatusSlice'
import {
  asyncFetchRooms,
  fetchRooms
} from '../../stores/slices/roomsStatusSlice'
import { customAxios } from '../../components/organisms/utils/customAxios'
import { Employee_data } from '../../types/employee'
import { FurnitureData, Furniture_data } from '../../types/furniture'
import { RoomData, Room_data } from '../../types/room'
import { EMPLOYEEURI } from '../../components/organisms/utils/cloudUri'
import { OfficeData } from '../../types/office'

type PutRequest = {
  isExit: boolean
  officeId: string
  employeeId: string
}

const useOfficePageInitialize = (
  officeData: Pick<OfficeData, 'officeId' | 'officeName'>,
  yourEmployeeId: string,
  employeeList: EmployeeData[],
  roomList: RoomData[],
  furnitureList: FurnitureData[]
) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const officeId = router.query.office_id as string
  const employeeId = router.query.employee_id as string

  useEffect(() => {
    //ISRで取得したデータをstoreに格納
    dispatch(
      fetchEmployeesStatus({
        yourId: yourEmployeeId,
        employees: employeeList
      })
    )
    dispatch(fetchOffice(officeData))
    dispatch(fetchRooms(roomList))
    dispatch(fetchFurniture(furnitureList))

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
      customAxios.put(EMPLOYEEURI, employeeParams, {
        withCredentials: true
      })
    }

    return () => {
      leave()
    }
  }, [])

  useEffect(() => {
    const employeeReq: PutRequest = {
      isExit: false,
      officeId: router.query.office_id as string,
      employeeId: router.query.employee_id as string
    }
    const employeeReqJSON = JSON.stringify(employeeReq)
    let employeeParams = new URLSearchParams()
    employeeParams.append('data', employeeReqJSON)
    customAxios.defaults.withCredentials = true
    customAxios.put(EMPLOYEEURI, employeeParams, {
      withCredentials: true
    })
  }, [])

  useEffect(() => {
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
    //スクロールした座標を更新
    const scrollAction = () => {}
    window.addEventListener('scroll', () => {
      dispatch(
        setScrollValue({ scrollX: window.scrollX, scrollY: window.scrollY })
      )
    })

    return window.removeEventListener('scroll', scrollAction)
  }, [])

  useEffect(() => {
    dispatch(asyncFetchOffice(officeId))
    dispatch(fetchEmployeeId(employeeId))
    dispatch(asyncFetchEmployees(officeId))
    dispatch(asyncFetchRooms(officeId))
    dispatch(asyncFetchFurniture(officeId))
  }, [])

  useEffect(() => {
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
        const rooms = snapshot.data().rooms as Room_data[]
        const roomList = rooms.map((room) => {
          return {
            roomId: room.room_id,
            xCoordinate: room.x_coordinate,
            yCoordinate: room.y_coordinate,
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
        const furnitureList: FurnitureData[] = []
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
        dispatch(fetchFurniture(furnitureList))
      })
    return unsubscribe
  }, [])
}

export default useOfficePageInitialize

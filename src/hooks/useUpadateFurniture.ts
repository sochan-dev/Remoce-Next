import { useState, useEffect, ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getOfficeId } from '../stores/slices/officeStatusSlice'
import {
  getNewFurniture,
  setNewFurnitureName,
  setNewFurnitureDetail,
  setNewFurnitureSize,
  setNewFurnitureIsClose,
  setNewFurnitureAuthorities
} from '../stores//slices/newFurnitureSlice'
import { db } from '../../firebase'

type Employee_data = {
  employee_name: string
  employee_picture: string
  employee_x_coordinate: number
  employee_y_coordinate: number
}

type Employees = {
  label: string
  value: string
}[]

type Furniture = {
  room_id: string
  furniture_name: string
  furniture_detail: string
  furniture_size: number
  is_close: boolean
  authorities: string[]
  x_coordinate: number
  y_coordinate: number
  join_employees: []
}

const useUpdateFurniture = () => {
  const selector = useSelector((state) => state)
  const dispatch = useDispatch()
  const {
    furnitureName,
    furnitureDetail,
    furnitureSize,
    isClose,
    authorities
  } = getNewFurniture(selector)
  const [employees, setEmployees] = useState<Employees>([]) //候補のメンバーを格納。照合処理に使う
  const officeId = getOfficeId(selector)

  useEffect(() => {
    db.collection('offices')
      .doc(officeId)
      .collection('employees')
      .get()
      .then((snapshots) => {
        const employeeList: Employees = []
        snapshots.forEach((snapshot) => {
          const employeeId = snapshot.id
          const employee = snapshot.data() as Employee_data
          employeeList.push({
            label: employee.employee_name,
            value: employeeId
          })
        })
        setEmployees(employeeList)
      })
  }, [])

  const selectedAuthorities = authorities.map((authority) => {
    let label: string
    employees.forEach((employee) => {
      if (employee.value === authority) label = employee.label
    })
    return {
      label: label,
      value: authority
    }
  })

  const furnitureSizeRadioList = [
    {
      id: 1,
      value: 1,
      label: 'small',
      isChecked: furnitureSize === 1 ? true : false
    },
    {
      id: 2,
      value: 2,
      label: 'medium',
      isChecked: furnitureSize === 2 ? true : false
    },
    {
      id: 3,
      value: 3,
      label: 'large',
      isChecked: furnitureSize === 3 ? true : false
    }
  ]

  const isCloseRadioList = [
    {
      id: 1,
      value: 'open',
      label: '公開',
      isChecked: isClose ? false : true
    },
    {
      id: 2,
      value: 'close',
      label: '非公開',
      isChecked: isClose ? true : false
    }
  ]

  const formControls = {
    furnitureName: furnitureName,
    furnitureDetail: furnitureDetail,
    furnitureSize: furnitureSizeRadioList,
    isClose: isCloseRadioList,
    authorities: {
      selectedAuthorities: selectedAuthorities,
      employees: employees
    }
  }

  const changeFunctions = {
    setFurnitureName: (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setNewFurnitureName(e.target.value))
    },

    setFurnitureDetail: (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setNewFurnitureDetail(e.target.value))
    },

    setFurnitureSize: (e: ChangeEvent<HTMLInputElement>) => {
      const checkedType = Number(e.target.value)
      dispatch(setNewFurnitureSize(checkedType))
    },

    setIsClose: (e: ChangeEvent<HTMLInputElement>) => {
      const checkedType = e.target.value
      let newIsClose = false
      switch (checkedType) {
        case 'open':
          newIsClose = false
          break
        case 'close':
          newIsClose = true
          break
      }
      dispatch(setNewFurnitureIsClose(newIsClose))
    },

    setAuthorities: (
      selectedAuthorities: { value: string; label: string }[]
    ) => {
      const newAuthorities: string[] = selectedAuthorities.map((authority) => {
        return authority.value
      })
      dispatch(setNewFurnitureAuthorities(newAuthorities))
    }
  }

  return [formControls, changeFunctions] as const
}

export default useUpdateFurniture

/*
useEffect(() => {
    db.collection('offices')
      .doc(officeId)
      .collection('employees')
      .get()
      .then(async (snapshots) => {
        const employeeList: Employees = []
        snapshots.forEach((snapshot) => {
          const employeeId = snapshot.id
          const employee = snapshot.data() as Employee_data
          employeeList.push({
            label: employee.employee_name,
            value: employeeId
          })
        })
        setEmployees(employeeList)
        await db
          .collection('offices')
          .doc(officeId)
          .collection('furniture')
          .doc(furnitureId)
          .get()
          .then((snapshot) => {
            const furniture = snapshot.data() as Furniture

            dispatch(
              setUpdateFurniture({
                furnitureName: furniture.furniture_name,
                furnitureDetail: furniture.furniture_detail,
                furnitureSize: furniture.furniture_size,
                isClose: furniture.is_close,
                authorities: furniture.authorities,
                updateInfo: {
                  furnitureId: snapshot.id,
                  xCoordinate: furniture.x_coordinate,
                  yCoordinate: furniture.y_coordinate
                }
              })
            )
          })
      })
  }, [])

*/

/*
/*const [furnitureName, setFurnitureName] = useState('')
  const [furnitureDetail, setFurnitureDetail] = useState('')
  const [furnitureSize, setFurnitureSize] = useState(2)
  const [isClose, setIsClose] = useState(false)
  const [authorities, setAuthorities] = useState<string[]>([]) //権限者のidを格納。*/

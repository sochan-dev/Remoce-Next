import { useState, useEffect, ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getOfficeId } from '../../../stores/slices/officeStatusSlice'
import {
  getNewFurniture,
  setNewFurnitureName,
  setNewFurnitureDetail,
  setNewFurnitureSize,
  setNewFurnitureIsClose,
  setNewFurnitureAuthorities,
  setNewFurnitureColor
} from '../../../stores/slices/newFurnitureSlice'
import { db } from '../../../../firebase'
import { Employee_data } from '../../../types/employee'
import { Color, RadioValue } from '../../../types/form'
interface isCloseRadioValue {
  id: number
  value: 'open' | 'close'
  label: '通話不可' | '通話可能'
  isChecked: boolean
}

type Employees = {
  label: string
  value: string
}[]

const colors: Color[] = [
  {
    label: '白色',
    value: 'white'
  },
  {
    label: '黒色',
    value: 'black'
  },
  {
    label: '赤色',
    value: 'red'
  },
  {
    label: '青色',
    value: 'blue'
  },
  {
    label: '黄色',
    value: 'yellow'
  },
  {
    label: '緑色',
    value: 'green'
  }
]

const useUpdateFurnitureForm = () => {
  const selector = useSelector((state) => state)
  const dispatch = useDispatch()
  const {
    updateInfo,
    furnitureName,
    furnitureDetail,
    furnitureSize,
    furnitureColor,
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
  const selectedColor = colors.filter((c) => {
    if (c.value === furnitureColor) return c
  })[0]
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

  const furnitureSizeRadioList: RadioValue[] = [
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

  const isCloseRadioList: isCloseRadioValue[] = [
    {
      id: 1,
      value: 'open',
      label: '通話可能',
      isChecked: isClose ? false : true
    },
    {
      id: 2,
      value: 'close',
      label: '通話不可',
      isChecked: isClose ? true : false
    }
  ]

  const formControls = {
    furnitureId: updateInfo ? updateInfo.furnitureId : false,
    furnitureName: furnitureName,
    furnitureDetail: furnitureDetail,
    furnitureSize: furnitureSizeRadioList,
    isClose: isCloseRadioList,
    furnitureColor: {
      selectedColor: selectedColor,
      colors: colors
    },
    authorities: {
      selectedAuthorities: selectedAuthorities,
      employees: employees
    }
  }

  const changeFunctions = {
    setFurnitureName: (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setNewFurnitureName(e.target.value))
    },

    setFurnitureDetail: (e: ChangeEvent<HTMLTextAreaElement>) => {
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
    setFurnitureColor: (selectColor: Color) => {
      dispatch(setNewFurnitureColor(selectColor.value))
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

export default useUpdateFurnitureForm

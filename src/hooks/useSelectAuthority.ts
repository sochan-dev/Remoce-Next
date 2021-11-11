import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNewFurnitureAuthorities,
  getNewFurnitureAuthorities
} from '../stores/slices/newFurnitureSlice'
import { getOfficeId } from '../stores/slices/officeStatusSlice'
import { db } from '../../firebase'
import { Employee_data } from '../types/employee'

type Employees = {
  label: string
  value: string
}[]

const useSelectAuthority = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [employees, setEmployees] = useState<Employees>([])
  const authorities = getNewFurnitureAuthorities(selector)
  const officeId = getOfficeId(selector)

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

  const selectAuthority = (
    selectedAuthorities: { value: string; label: string }[]
  ) => {
    const authorities: string[] = selectedAuthorities.map((authority) => {
      return authority.value
    })
    console.log('selectAuthority', authorities)
    dispatch(setNewFurnitureAuthorities(authorities))
  }

  useEffect(() => {
    db.collection('offices')
      .doc(officeId)
      .collection('employees')
      .get()
      .then((snapshots) => {
        snapshots.forEach((snapshot) => {
          const employeeId = snapshot.id
          const employee = snapshot.data() as Employee_data

          setEmployees((beforeEmployees) => {
            return [
              ...beforeEmployees,
              {
                label: employee.employee_name,
                value: employeeId
              }
            ]
          })
        })
      })
  }, [officeId])
  const authorityData = {
    employees: employees,
    selectedAuthorities: selectedAuthorities
  }
  return [authorityData, selectAuthority] as const
}

export default useSelectAuthority

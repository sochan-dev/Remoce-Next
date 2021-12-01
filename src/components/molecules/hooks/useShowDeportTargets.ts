import { useState, useEffect, VFC } from 'react'
import { useSelector } from 'react-redux'
import { db } from '../../../../firebase'
import { getOfficeId } from '../../../stores/slices/officeStatusSlice'
import { EmployeeData, Employee_data } from '../../../types/employee'

const useShowDeportTargets = () => {
  const selector = useSelector((state) => state)
  const officeId = getOfficeId(selector)
  const [targetEmployees, setTargetEmployees] = useState<
    Pick<EmployeeData, 'employeeId' | 'employeeName'>[]
  >([])

  useEffect(() => {
    db.collection('offices')
      .doc(officeId)
      .collection('employees')
      .get()
      .then((snapshots) => {
        let targetEmployeesList: typeof targetEmployees = []
        snapshots.forEach((snapshot) => {
          const employee = snapshot.data() as Employee_data
          targetEmployeesList.push({
            employeeId: snapshot.id,
            employeeName: employee.employee_name
          })
        })
        setTargetEmployees(targetEmployeesList)
      })
  }, [])

  return targetEmployees
}

export default useShowDeportTargets

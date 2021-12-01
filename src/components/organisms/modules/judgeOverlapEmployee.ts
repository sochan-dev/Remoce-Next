import { EmployeeData } from '../../../types/employee'
import { SENSORSIZE, ROOMSIZE } from '../utils/iconSize'

type OverlapEmployee = {
  employeeId: string
  halfwayPointX: number
  halfwayPointY: number
}

export const judgeOverLapEmployee = (
  xCoordinate: number,
  yCoordinate: number,
  ownId: string,
  employees: EmployeeData[]
): OverlapEmployee[] | false => {
  let overlapEmployees: OverlapEmployee[] = []
  const sensorStartX = xCoordinate
  const sensorStartY = yCoordinate
  const sensorCenterX = sensorStartX + SENSORSIZE / 2
  const sensorCenterY = sensorStartY + SENSORSIZE / 2
  employees.forEach((employee) => {
    if (ownId !== employee.employeeId) {
      const employeeStartX = employee.xCoordinate
      const employeeStartY = employee.yCoordinate
      const employeeCenterX = employeeStartX + SENSORSIZE / 2
      const employeeCenterY = employeeStartY + SENSORSIZE / 2

      const crotchNum = sensorCenterX - employeeCenterX
      const hookNum = sensorCenterY - employeeCenterY
      const bowstringNum = crotchNum * crotchNum + hookNum * hookNum
      const radiusSum = SENSORSIZE //二つの円の半径の合計
      if (bowstringNum <= radiusSum * radiusSum) {
        const wayX =
          sensorCenterX <= employeeCenterX
            ? Math.round(Math.abs(crotchNum / 2))
            : Math.round(Math.abs(crotchNum / 2)) * -1
        const wayY =
          sensorCenterY <= employeeCenterY
            ? Math.round(Math.abs(hookNum / 2))
            : Math.round(Math.abs(hookNum / 2)) * -1
        const halfwayPointX = Math.round((sensorCenterX + employeeCenterX) / 2)
        const halfwayPointY = Math.round((sensorCenterY + employeeCenterY) / 2)

        const overlapEmployee: OverlapEmployee = {
          employeeId: employee.employeeId,
          halfwayPointX:
            halfwayPointX -
            ROOMSIZE / 2 /*sensorCenterX + wayX - ROOMSIZE / 2*/,
          halfwayPointY:
            halfwayPointY - ROOMSIZE / 2 /*sensorCenterY + wayY - ROOMSIZE / 2*/
        }
        overlapEmployees.push(overlapEmployee)
      }
    }
  })
  return overlapEmployees.length > 0 ? overlapEmployees : false
}

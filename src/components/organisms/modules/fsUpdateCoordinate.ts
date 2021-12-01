import { db } from '../../../../firebase'

export const fsUpdateCoordinate = async (
  officeId: string,
  employeeId: string,
  xCoordinate: number,
  yCoordinate: number
): Promise<boolean> => {
  let isSuccess: boolean
  await db
    .collection('offices')
    .doc(officeId)
    .collection('employees')
    .doc(employeeId)
    .update({
      employee_x_coordinate: Math.round(xCoordinate),
      employee_y_coordinate: Math.round(yCoordinate)
    })
    .then(() => {
      isSuccess = true
    })
    .catch(() => {
      isSuccess = false
    })
  return isSuccess
}

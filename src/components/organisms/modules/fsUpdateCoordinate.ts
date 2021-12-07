import { db } from '../../../../firebase'

export const fsUpdateCoordinate = async (
  officeId: string,
  employeeId: string,
  xCoordinate: number,
  yCoordinate: number
): Promise<boolean> => {
  console.log('座標更新発火！！')
  console.log('生', xCoordinate, yCoordinate)
  console.log('更新情報', Math.round(xCoordinate), Math.round(yCoordinate))
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

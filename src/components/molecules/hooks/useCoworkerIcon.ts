import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { db, storage } from '../../../../firebase'
import { updateEmployee } from '../../../stores/slices/employeesStatusSlice'
import userIcon from '../../../../public/image/initial-user-icon.png'
import { EmployeeData, Employee_data } from '../../../types/employee'

const useCoworkerIcon = (
  id: number,
  officeId: string,
  ownData: Omit<EmployeeData, 'editPermission'>
) => {
  const dispatch = useDispatch()
  const [iconURL, setIconURL] = useState(userIcon)
  const pictureRef = ownData.employeePicture
  useEffect(() => {
    if (pictureRef !== '') {
      const imgRef = storage.ref().child(pictureRef)
      imgRef.getDownloadURL().then((url) => {
        setIconURL(url)
      })
    }
  }, [pictureRef])
  useEffect(() => {
    const unsubscribe = db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(ownData.employeeId)
      .onSnapshot((doc) => {
        const employee = doc.data() as Employee_data
        const employeeData: EmployeeData = {
          employeeId: doc.id,
          employeeName: employee.employee_name,
          employeePicture: employee.employee_picture,
          editPermission: employee.edit_permission,
          xCoordinate: employee.employee_x_coordinate,
          yCoordinate: employee.employee_y_coordinate
        }

        dispatch(updateEmployee({ id: id, employeeData: employeeData }))
      })

    return unsubscribe
  }, [])
  const imgStyle = {
    backgroundImage: `url(${iconURL})`,
    backgroundSize: 'cover'
  }

  return imgStyle
}

export default useCoworkerIcon

import React, {
  VFC,
  useEffect,
  useState,
  Dispatch,
  SetStateAction
} from 'react'
import { useDispatch } from 'react-redux'
import { db, storage } from '../../../firebase'
import { updateEmployee } from '../../stores/slices/employeesStatusSlice'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Styles from '../../../styles/sass/employeeIcon.module.scss'
import userIcon from '../../../public/image/initial-user-icon.png'
import classNames from 'classnames'
import { EmployeeData, Employee_data } from '../../types/employee'

type props = {
  id: number
  officeId: string
  isDrag: boolean
  setIsDrag: Dispatch<SetStateAction<boolean>>
  ownData: Omit<EmployeeData, 'editPermission'>
}

const CoworkerIcon: VFC<props> = (props) => {
  const dispatch = useDispatch()
  const { id, officeId, ownData, isDrag } = props
  const [isHover, setIsHover] = useState(false)
  const [iconURL, setIconURL] = useState(userIcon)
  const initialCoordinate = {
    left: ownData.xCoordinate,
    top: ownData.yCoordinate
  }
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

  return (
    <div
      className={classNames(Styles.coworker, isDrag && Styles.coworkerSensor)}
      style={initialCoordinate}
    >
      <div
        onMouseOver={() => setIsHover(true)}
        className={Styles.icon}
        style={imgStyle}
      >
        {/*<img src={iconURL} alt="" className={Styles.icon} />*/}
      </div>
      {isHover && (
        <div className={Styles.hover} onMouseOut={() => setIsHover(false)}>
          <p>{ownData.employeeName}</p>
        </div>
      )}
    </div>
  )
}

export default CoworkerIcon

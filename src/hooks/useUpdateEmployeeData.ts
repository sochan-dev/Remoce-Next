import React, { VFC, useState, useEffect, ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getEmployeeId,
  updateOwnEmployee
} from '../stores/slices/employeesStatusSlice'
import { getOfficeId } from '../stores/slices/officeStatusSlice'
import { db, storage, auth } from '../../firebase'
import loadImage from 'blueimp-load-image'
import userIcon from '../../public/image/initial-user-icon.png'
import { Employee_data } from '../types/employee'

const useUpdateEmployeeData = () => {
  const selector = useSelector((state) => state)
  const dispatch = useDispatch()
  const [employeeName, setEmployeeName] = useState('')
  const [profileImg, setProfileImg] = useState(userIcon)
  const [isUpdateEmployee, setIsUpdateEmployee] = useState(false)
  const [isUpload, setIsUpload] = useState(false)
  const officeId = getOfficeId(selector)
  const employeeId = getEmployeeId(selector)

  const ownData = {
    isChange: isUpdateEmployee || isUpload,
    employeeId: employeeId,
    employeeName: employeeName,
    profileImg: profileImg
  }
  const inputStates = {
    inputEmployeeName: (e: ChangeEvent<HTMLInputElement>) => {
      setEmployeeName(e.target.value)
      setIsUpdateEmployee(true)
    },
    inputProfileImg: (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target
      if (files.length === 0) return
      setProfileImg(window.URL.createObjectURL(files[0]))
      setIsUpload(true)
    }
  }

  useEffect(() => {
    db.collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(employeeId)
      .get()
      .then(async (snapshot) => {
        const { employee_name, employee_picture } =
          snapshot.data() as Employee_data
        setEmployeeName(employee_name)
        if (employee_picture !== '') {
          const imgRef = storage.ref().child(employee_picture)
          imgRef.getDownloadURL().then((url) => {
            setProfileImg(url)
          })
        }
      })
  }, [])

  const updateEmployee = async (afterFunction?: () => any) => {
    if (isUpdateEmployee) {
      let uid = ''
      auth.onAuthStateChanged((user) => {
        uid = user.uid
      })
      const employeeRef = db
        .collection('offices')
        .doc(officeId)
        .collection('employees')
        .doc(employeeId)
      const employeeToUserRef = db
        .collection('users')
        .doc(uid)
        .collection('employee_to_office')
        .doc(employeeId)
      await db.runTransaction(async (transaction) => {
        transaction.update(employeeRef, {
          employee_name: employeeName
        })
        transaction.update(employeeToUserRef, {
          employee_name: employeeName
        })
      })
    }

    if (isUpload) {
      const canvas = await loadImage(profileImg, {
        maxWidth: 200,
        minWidth: 200,
        canvas: true
      })
      await canvas.image.toBlob((blob) => {
        storage.ref().child(`/${employeeId}/profileIcon`).put(blob)
      }, profileImg.type)

      await db
        .collection('offices')
        .doc(officeId)
        .collection('employees')
        .doc(employeeId)
        .update({
          employee_picture: `/${employeeId}/profileIcon`
        })
    }

    await db
      .collection('offices')
      .doc(officeId)
      .collection('employees')
      .doc(employeeId)
      .get()
      .then((snapshot) => {
        const employee_data = snapshot.data() as Employee_data
        const employeeData = {
          employeeName: employee_data.employee_name,
          xCoordinate: employee_data.employee_x_coordinate,
          yCoordinate: employee_data.employee_y_coordinate
        }
        dispatch(updateOwnEmployee(employeeData))
      })

    afterFunction && afterFunction()
  }

  return [ownData, updateEmployee, inputStates] as const
}

export default useUpdateEmployeeData

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  turnAccessRightMessage,
  getIsAccessRightMessage
} from '../../../stores/slices/dialogsStatusSlice'

const useCheckMediaDeviceRight = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [right, setRight] = useState(false)
  const isOpen = getIsAccessRightMessage(selector)
  useEffect(() => {
    if (!right) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((snapshot) => {
          snapshot.getTracks().forEach((track) => track.stop())
          setRight(true)
        })
        .catch((e) => {
          dispatch(turnAccessRightMessage({ isOpen: true }))
        })
    }
  }, [])

  return [isOpen, right] as const
}

export default useCheckMediaDeviceRight

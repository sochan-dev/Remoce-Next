import React, { useState, useEffect, VFC, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  turnAccessRightMessage,
  getIsAccessRightMessage
} from '../../stores/slices/dialogsStatusSlice'
import { VersatilityDialog } from '../organisms'

type props = {
  children: ReactNode
}

const CheckMediaDeviceRight: VFC<props> = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [right, setRight] = useState(false)
  const isOpen = getIsAccessRightMessage(selector)
  const pathArray = router.pathname.split('/')

  useEffect(() => {
    if (!right) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((snapshot) => {
          console.log('許可済')
          snapshot.getTracks().forEach((track) => track.stop())
          setRight(true)
        })
        .catch((e) => {
          dispatch(turnAccessRightMessage({ isOpen: true }))
          console.log('許可していない', e)
        })
    }
  }, [])

  return (
    <>
      {(pathArray[1] !== 'office' || right) && children}
      {!right && (
        <VersatilityDialog
          isOpen={isOpen}
          setIsOpen={turnAccessRightMessage}
          maxWidth={'lg'}
          keep
        >
          <p>カメラとオーディオのアクセスを許可してください。</p>
        </VersatilityDialog>
      )}
    </>
  )
}

export default CheckMediaDeviceRight

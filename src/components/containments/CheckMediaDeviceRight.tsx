import React, { VFC, ReactNode } from 'react'
import { turnAccessRightMessage } from '../../stores/slices/dialogsStatusSlice'
import { VersatilityDialog } from '../organisms'
import { useCheckMediaDeviceRight } from './hooks'

type Props = {
  children: ReactNode
}

const CheckMediaDeviceRight: VFC<Props> = ({ children }) => {
  const [isOpen, right] = useCheckMediaDeviceRight()

  return (
    <>
      {right ? (
        children
      ) : (
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

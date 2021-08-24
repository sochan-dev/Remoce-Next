import React, {
  cloneElement,
  VFC,
  SetStateAction,
  Dispatch,
  ReactNode
} from 'react'
import { useDispatch } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'

type props = {
  isOpen: boolean
  setIsOpen: ActionCreatorWithOptionalPayload<{ isOpen: boolean }, string>
  maxWidth: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}

const VersatilityDialog: VFC<props> = (props) => {
  const { isOpen, setIsOpen, maxWidth, children } = props
  const dispatch = useDispatch()

  const handleSetIsOpen = (isOpen: boolean) => {
    dispatch(setIsOpen({ isOpen: isOpen }))
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        keepMounted
        onClose={() => handleSetIsOpen(false)}
        maxWidth={maxWidth}
      >
        <DialogContent>{isOpen && children}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => dispatch(setIsOpen({ isOpen: isOpen }))}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => dispatch(setIsOpen({ isOpen: isOpen }))}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default VersatilityDialog

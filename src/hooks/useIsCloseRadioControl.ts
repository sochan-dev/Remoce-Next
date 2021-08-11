import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNewFurnitureIsClose,
  getNewFurnitureIsClose
} from '../stores/slices/newFurnitureSlice'

const useCloseRadioControl = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const isClose = getNewFurnitureIsClose(selector)

  const changeIsClose = (e: ChangeEvent<HTMLInputElement>) => {
    const checkedType = e.target.value
    let newIsClose = false
    switch (checkedType) {
      case 'open':
        newIsClose = false
        break
      case 'close':
        newIsClose = true
        break
    }
    dispatch(setNewFurnitureIsClose(newIsClose))
  }

  const isCloseRadioList = [
    {
      id: 1,
      value: 'open',
      label: '公開',
      isChecked: isClose ? false : true
    },
    {
      id: 2,
      value: 'close',
      label: '非公開',
      isChecked: isClose ? true : false
    }
  ]

  return [changeIsClose, isCloseRadioList] as const
}

export default useCloseRadioControl

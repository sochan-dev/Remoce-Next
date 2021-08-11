import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNewFurnitureSize,
  getNewFurnitureSize,
  getNewFurnitureIsClose,
  FurnitureSize
} from '../stores/slices/newFurnitureSlice'

const useFurnitureRadioControl = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const newFurnitureSize = getNewFurnitureSize(selector)
  const f = getNewFurnitureIsClose(selector)
  console.log('newFurnitureSize', newFurnitureSize, 'isClose', f)

  const changeFurnitureSize = (e: ChangeEvent<HTMLInputElement>) => {
    const checkedType = e.target.value as FurnitureSize
    dispatch(setNewFurnitureSize(checkedType))
  }

  const furnitureSizeRadioList = [
    {
      id: 1,
      value: 'small',
      label: 'small',
      isChecked: newFurnitureSize === 'small' ? true : false
    },
    {
      id: 2,
      value: 'medium',
      label: 'medium',
      isChecked: newFurnitureSize === 'medium' ? true : false
    },
    {
      id: 3,
      value: 'large',
      label: 'large',
      isChecked: newFurnitureSize === 'large' ? true : false
    }
  ]
  console.log('furnitureSizeRadioList', furnitureSizeRadioList)
  return [changeFurnitureSize, furnitureSizeRadioList] as const
}

export default useFurnitureRadioControl

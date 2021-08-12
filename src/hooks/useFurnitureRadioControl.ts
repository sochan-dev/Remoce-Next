import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNewFurnitureSize,
  getNewFurnitureSize,
  getNewFurnitureIsClose
} from '../stores/slices/newFurnitureSlice'

const useFurnitureRadioControl = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const newFurnitureSize = getNewFurnitureSize(selector)
  const f = getNewFurnitureIsClose(selector)
  console.log('newFurnitureSize', newFurnitureSize, 'isClose', f)

  const changeFurnitureSize = (e: ChangeEvent<HTMLInputElement>) => {
    const checkedType = Number(e.target.value)
    dispatch(setNewFurnitureSize(checkedType))
  }

  const furnitureSizeRadioList = [
    {
      id: 1,
      value: 1,
      label: 'small',
      isChecked: newFurnitureSize === 1 ? true : false
    },
    {
      id: 2,
      value: 2,
      label: 'medium',
      isChecked: newFurnitureSize === 2 ? true : false
    },
    {
      id: 3,
      value: 3,
      label: 'large',
      isChecked: newFurnitureSize === 3 ? true : false
    }
  ]
  console.log('furnitureSizeRadioList', furnitureSizeRadioList)
  return [changeFurnitureSize, furnitureSizeRadioList] as const
}

export default useFurnitureRadioControl

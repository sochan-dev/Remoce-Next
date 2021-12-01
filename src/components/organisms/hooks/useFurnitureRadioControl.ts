import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNewFurnitureSize,
  getNewFurnitureSize
} from '../../../stores/slices/newFurnitureSlice'
import { RadioValue } from '../../../types/form'

const useFurnitureRadioControl = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const newFurnitureSize = getNewFurnitureSize(selector)

  const changeFurnitureSize = (e: ChangeEvent<HTMLInputElement>) => {
    const checkedType = Number(e.target.value)
    dispatch(setNewFurnitureSize(checkedType))
  }

  const furnitureSizeRadioList: RadioValue[] = [
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

  return [changeFurnitureSize, furnitureSizeRadioList] as const
}

export default useFurnitureRadioControl

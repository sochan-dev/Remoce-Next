import {
  getNewFurnitureColor,
  setNewFurnitureColor
} from '../../../stores/slices/newFurnitureSlice'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Color } from '../../../types/form'

const colors: Color[] = [
  {
    label: '白色',
    value: 'white'
  },
  {
    label: '黒色',
    value: 'black'
  },
  {
    label: '赤色',
    value: 'red'
  },
  {
    label: '青色',
    value: 'blue'
  },
  {
    label: '黄色',
    value: 'yellow'
  },
  {
    label: '緑色',
    value: 'green'
  }
]
const useSelectColor = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const color = getNewFurnitureColor(selector)
  const selectColor = (selectColor: Color) => {
    dispatch(setNewFurnitureColor(selectColor.value))
  }
  const selectedColor = colors.filter((c) => {
    if (c.value === color) return c
  })[0]

  return [selectedColor, selectColor, colors] as const
}

export default useSelectColor

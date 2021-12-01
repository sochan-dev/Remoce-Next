import React, { VFC, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getNewFurniture,
  setNewFurnitureName,
  setNewFurnitureDetail
} from '../../../stores/slices/newFurnitureSlice'

const useCreateFurnitureForm = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)

  const { furnitureName, furnitureDetail } = getNewFurniture(selector)

  const inputFurnitureName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewFurnitureName(e.target.value))
  }
  const inputFurnitureDetail = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNewFurnitureDetail(e.target.value))
  }

  const furnitureInfo = {
    furnitureName: furnitureName,
    furnitureDetail: furnitureDetail
  }
  const furnitureControls = {
    inputFurnitureName: inputFurnitureName,
    inputFurnitureDetail: inputFurnitureDetail
  }
  return [furnitureInfo, furnitureControls] as const
}
export default useCreateFurnitureForm

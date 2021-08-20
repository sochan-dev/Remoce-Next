import React, { VFC, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useFurnitureRadioControl,
  useIsCloseRadioControl,
  useSelectAuthority
} from '../../hooks'
import { RadioButtons } from '../molecules'
import {
  getNewFurniture,
  setNewFurnitureName,
  setNewFurnitureDetail,
  getNewFurnitureSize
} from '../../stores/slices/newFurnitureSlice'
import { InputText } from '../atoms'
import Select from 'react-select'
import Styles from '../../../styles/sass/createFurnitureForm.module.scss'
import { OBJECTSIZE } from './utils/iconSize'

const CreateFurnitureForm: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [changeFurnitureSize, furnitureSizeRadioList] =
    useFurnitureRadioControl()
  const [changeIsClose, isCloseRadioList] = useIsCloseRadioControl()
  const [authorityData, selectAuthority] = useSelectAuthority()
  const { furnitureName, furnitureDetail } = getNewFurniture(selector)
  const furnitureSize = getNewFurnitureSize(selector)

  const height = furnitureSize * 100 + 300

  const formHeight = {
    height: height
  }

  const inputFurnitureName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewFurnitureName(e.target.value))
  }
  const inputFurnitureDetail = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewFurnitureDetail(e.target.value))
  }

  return (
    <div className={Styles.root} style={formHeight}>
      <InputText
        label={'オブジェクト名を入力してください'}
        value={furnitureName}
        onChange={inputFurnitureName}
      />
      <InputText
        label={'オブジェクトの詳細を入力してください'}
        value={furnitureDetail}
        onChange={inputFurnitureDetail}
      />
      <RadioButtons
        onChange={changeFurnitureSize}
        name={'furnitureSize'}
        radioList={furnitureSizeRadioList}
      />
      <RadioButtons
        onChange={changeIsClose}
        name={'isClose'}
        radioList={isCloseRadioList}
      />
      <Select
        isMulti
        options={authorityData.employees}
        onChange={selectAuthority}
        id="authorities"
        instanceId="authorities"
        value={authorityData.selectedAuthorities}
      />
    </div>
  )
}

export default CreateFurnitureForm

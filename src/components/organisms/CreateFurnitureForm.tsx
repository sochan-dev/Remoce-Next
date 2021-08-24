import React, { VFC, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useFurnitureRadioControl,
  useIsCloseRadioControl,
  useSelectAuthority
} from '../../hooks'
import { RadioButtons } from '../molecules'
import { VirtualArea } from '.'
import {
  getNewFurniture,
  setNewFurnitureName,
  setNewFurnitureDetail,
  getNewFurnitureSize
} from '../../stores/slices/newFurnitureSlice'
import { InputText } from '../atoms'
import Select from 'react-select'
import Styles from '../../../styles/sass/createFurnitureForm.module.scss'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'

const CreateFurnitureForm: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [changeFurnitureSize, furnitureSizeRadioList] =
    useFurnitureRadioControl()
  const [changeIsClose, isCloseRadioList] = useIsCloseRadioControl()
  const [authorityData, selectAuthority] = useSelectAuthority()
  const { furnitureName, furnitureDetail } = getNewFurniture(selector)
  const furnitureSize = getNewFurnitureSize(selector)

  const inputFurnitureName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewFurnitureName(e.target.value))
  }
  const inputFurnitureDetail = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewFurnitureDetail(e.target.value))
  }

  return (
    <div className={Styles.root}>
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
        id="authoritie"
        instanceId="authoritie"
        value={authorityData.selectedAuthorities}
      />
      <VirtualArea />
    </div>
  )
}

export default CreateFurnitureForm

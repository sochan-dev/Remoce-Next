import React, { VFC, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useFurnitureRadioControl,
  useIsCloseRadioControl,
  useSelectAuthority,
  useSelectColor
} from '../../hooks'
import { RadioButtons } from '../molecules'
import { VirtualArea } from '.'
import {
  getNewFurniture,
  setNewFurnitureName,
  setNewFurnitureDetail
} from '../../stores/slices/newFurnitureSlice'
import { InputText, TextArea } from '../atoms'
import Select from 'react-select'
import Styles from '../../../styles/sass/furnitureForm.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'

const CreateFurnitureForm: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [changeFurnitureSize, furnitureSizeRadioList] =
    useFurnitureRadioControl()
  const [changeIsClose, isCloseRadioList] = useIsCloseRadioControl()
  const [authorityData, selectAuthority] = useSelectAuthority()
  const [selectedColor, selectColor, colors] = useSelectColor()
  const { furnitureName, furnitureDetail } = getNewFurniture(selector)

  const inputFurnitureName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewFurnitureName(e.target.value))
  }
  const inputFurnitureDetail = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNewFurnitureDetail(e.target.value))
  }
  return (
    <div className={Styles.root}>
      <div className={Styles.form}>
        <InputText
          label={'オブジェクト名を入力してください'}
          value={furnitureName}
          onChange={inputFurnitureName}
        />
        <div className={Blanks.blank_16} />
        <TextArea
          label={'オブジェクトの詳細を入力してください'}
          value={furnitureDetail}
          onChange={inputFurnitureDetail}
          w={100}
        />
        <div>
          <RadioButtons
            onChange={changeFurnitureSize}
            name={'furnitureSize'}
            radioList={furnitureSizeRadioList}
          />
        </div>
        <div>
          <RadioButtons
            onChange={changeIsClose}
            name={'isClose'}
            radioList={isCloseRadioList}
          />
        </div>
        <Select
          options={colors}
          onChange={selectColor}
          id="colors"
          instanceId="colors"
          value={selectedColor}
        />
        <div className={Blanks.blank_16} />
        <Select
          isMulti
          options={authorityData.employees}
          onChange={selectAuthority}
          id="authoritie"
          instanceId="authoritie"
          value={authorityData.selectedAuthorities}
        />
      </div>
      <div>
        <VirtualArea />
      </div>
    </div>
  )
}

export default CreateFurnitureForm

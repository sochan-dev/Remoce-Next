import React, { useEffect, VFC } from 'react'
import { useDispatch } from 'react-redux'
import { InputText } from '../atoms'
import { RadioButtons } from '../molecules'
import { VirtualArea } from '../organisms'
import { useUpdateFurniture } from '../../hooks'
import Select from 'react-select'
import { clearNewFurniture } from '../../stores/slices/newFurnitureSlice'

const UpdateFurnitureForm: VFC = () => {
  const dispatch = useDispatch()
  const [formControls, changeFunctions] = useUpdateFurniture()
  const {
    furnitureName,
    furnitureDetail,
    furnitureSize,
    isClose,
    furnitureColor,
    authorities
  } = formControls
  const {
    setFurnitureName,
    setFurnitureDetail,
    setFurnitureSize,
    setIsClose,
    setFurnitureColor,
    setAuthorities
  } = changeFunctions

  useEffect(() => {
    return () => {
      {
        dispatch(clearNewFurniture())
      }
    }
  }, [])

  return (
    <>
      <div>
        <InputText
          label={'オブジェクト名を入力してください'}
          value={furnitureName}
          onChange={setFurnitureName}
        />
        <InputText
          label={'オブジェクトの詳細を入力してください'}
          value={furnitureDetail}
          onChange={setFurnitureDetail}
        />
        <RadioButtons
          onChange={setFurnitureSize}
          name={'furnitureSize'}
          radioList={furnitureSize}
        />
        <RadioButtons
          onChange={setIsClose}
          name={'isClose'}
          radioList={isClose}
        />
        <Select
          options={furnitureColor.colors}
          onChange={setFurnitureColor}
          id="colors"
          instanceId="colors"
          value={furnitureColor.selectedColor}
        />
        <Select
          isMulti
          options={authorities.employees}
          onChange={setAuthorities}
          id="authorities"
          instanceId="authorities"
          value={authorities.selectedAuthorities}
        />
        <VirtualArea update />
      </div>
    </>
  )
}

export default UpdateFurnitureForm

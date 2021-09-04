import React, { useEffect, VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InputText, ActionButton } from '../atoms'
import { RadioButtons } from '../molecules'
import { VirtualArea } from '../organisms'
import { useUpdateFurniture } from '../../hooks'
import Select from 'react-select'
import { clearNewFurniture } from '../../stores/slices/newFurnitureSlice'
import { turnUpdateFurniture } from '../../stores/slices/dialogsStatusSlice'
import { db } from '../../../firebase'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'

const UpdateFurnitureForm: VFC = () => {
  const dispatch = useDispatch()
  const selector = useSelector((state) => state)
  const [formControls, changeFunctions] = useUpdateFurniture()
  const {
    furnitureId,
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

  const deleteFurniture = async () => {
    const officeId = getOfficeId(selector)
    if (typeof furnitureId === 'boolean') return
    await db
      .collection('offices')
      .doc(officeId)
      .collection('furniture')
      .doc(furnitureId)
      .delete()
    dispatch(turnUpdateFurniture({ isOpen: false }))
  }

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
        <ActionButton
          w={20}
          label={'このオブジェクトを削除する'}
          onClick={deleteFurniture}
        />
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

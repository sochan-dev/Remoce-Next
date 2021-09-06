import React, { useEffect, VFC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { InputText, ActionButton, TextArea } from '../atoms'
import { RadioButtons } from '../molecules'
import { VirtualArea } from '../organisms'
import { useUpdateFurniture } from '../../hooks'
import Select from 'react-select'
import { clearNewFurniture } from '../../stores/slices/newFurnitureSlice'
import { turnUpdateFurniture } from '../../stores/slices/dialogsStatusSlice'
import { db } from '../../../firebase'
import { getOfficeId } from '../../stores/slices/officeStatusSlice'
import Styles from '../../../styles/sass/furnitureForm.module.scss'
import Blanks from '../../../styles/sass/blanks.module.scss'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'

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
      <div className={Styles.root}>
        <div className={Styles.form}>
          <InputText
            label={'オブジェクト名'}
            value={furnitureName}
            onChange={setFurnitureName}
          />
          <div className={Blanks.blank_16} />
          <TextArea
            label={'オブジェクト詳細'}
            value={furnitureDetail}
            onChange={setFurnitureDetail}
          />
          <div>
            <RadioButtons
              onChange={setFurnitureSize}
              name={'furnitureSize'}
              radioList={furnitureSize}
            />
          </div>
          <div>
            <RadioButtons
              onChange={setIsClose}
              name={'isClose'}
              radioList={isClose}
            />
          </div>
          <Select
            options={furnitureColor.colors}
            onChange={setFurnitureColor}
            id="colors"
            instanceId="colors"
            value={furnitureColor.selectedColor}
          />
          <div className={Blanks.blank_16} />
          <Select
            isMulti
            options={authorities.employees}
            onChange={setAuthorities}
            id="authorities"
            instanceId="authorities"
            value={authorities.selectedAuthorities}
          />
        </div>
        <div>
          <VirtualArea update />
        </div>
      </div>
      <div className={Styles.delete}>
        <div>
          <Tooltip title={'このオブジェクトを削除する'}>
            <IconButton onClick={deleteFurniture}>
              <DeleteOutlineOutlinedIcon color={'secondary'} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

export default UpdateFurnitureForm

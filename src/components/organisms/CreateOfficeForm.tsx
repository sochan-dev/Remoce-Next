import React, { VFC } from 'react'
import { InputText, ActionButton } from '../atoms'
import Blanks from '../../../styles/sass/blanks.module.scss'
import Styles from '../../../styles/sass/createOffice.module.scss'
import { useCreateOfficeForm } from './hooks'

const CreateOfficeHome: VFC = () => {
  const [formValues, formControls] = useCreateOfficeForm()

  return (
    <div className={Styles.root}>
      <h1>オフィスの作成</h1>
      <div className={Blanks.blank_32} />
      <InputText
        label={'リモートオフィスの名前'}
        type={'text'}
        value={formValues.officeName}
        onChange={formControls.inputOfficeName}
      />
      <div className={Blanks.blank_16} />
      <InputText
        label={'あなたの名前'}
        type={'text'}
        value={formValues.employeeName}
        onChange={formControls.inputEmployeeName}
      />
      <div className={Blanks.blank_16} />
      <ActionButton label={'登録'} onClick={formControls.createOffice} />
    </div>
  )
}

export default CreateOfficeHome

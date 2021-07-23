import React, { VFC, useContext } from 'react'
import { BelongOfficeListContext } from '../../pages/home/[user_id]'
import { BelongOfficeCard } from '../molecules'
import Styles from '../../../styles/sass/cardList.module.scss'

const ShowOfficeArea: VFC = () => {
  const belongOfficeList = useContext(BelongOfficeListContext)
  return (
    <div className={Styles.root}>
      {belongOfficeList.map((data, i) => (
        <BelongOfficeCard
          office_id={data.office_id}
          office_name={data.office_name}
          employee_id={data.employee_id}
          employee_name={data.employee_name}
          key={i}
        />
      ))}
    </div>
  )
}

export default ShowOfficeArea

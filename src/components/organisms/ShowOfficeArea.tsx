import React, { VFC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BelongOfficeCard } from '../molecules'
import { getWorkPlace } from '../../stores/slices/workPlacesSlice'
import Styles from '../../../styles/sass/cardList.module.scss'

const ShowOfficeArea: VFC = () => {
  const selector = useSelector((state) => state)
  const workPlaces = getWorkPlace(selector)

  return (
    <div className={Styles.root}>
      {workPlaces.map((data, i) => (
        <BelongOfficeCard
          officeId={data.officeId}
          officeName={data.officeName}
          employeeId={data.employeeId}
          employeeName={data.employeeName}
          key={i}
        />
      ))}
    </div>
  )
}

export default ShowOfficeArea
